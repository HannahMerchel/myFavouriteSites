import './app.scss';


chayns.ui.initAll();

let sites = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=10';
let numberOfSites = 10;

async function addSite(Site) {
    const newSite = document.createElement('a');
    newSite.classList.add('site');
    newSite.href = 'http://chayns.net/' + Site.siteId + '/';
    newSite.style.border = 0;
    document.getElementById('sitesList').appendChild(newSite);
    const icon = document.createElement('div');
    icon.classList.add('siteIcon');
    newSite.appendChild(icon);
    const title = document.createElement('div');
    let titleText = Site.appstoreName;
    if (titleText.length > 10) {
        titleText = titleText.substring(0, 10);
        titleText += '...';
    }
    title.textContent = titleText;
    title.classList.add('siteTitle');
    newSite.appendChild(title);

    await fetch('https://chayns.tobit.com/storage/' + Site.siteId + '/Images/icon-57.png', { method: 'HEAD' })
    .then(() => {
        icon.style.backgroundImage = 'url(\'https://chayns.tobit.com/storage/' + Site.siteId + '/Images/icon-57.png\')';
    }).catch(() => { icon.style.backgroundImage = 'url(\'https://sub60.tobit.com/l/152342?size=100\')'; });
}

function fetchSites() {
    fetch(sites)
    .then(response => response.json())
    .then((data) => {
        for (let Site in data.Data) {
            addSite(data.Data[Site]);
        }
    });
}

function loadMore() {
     sites = sites.replace(/Skip=\d*/, '&Skip='+numberOfSites);
     numberOfSites += 10;
     sites = sites.replace(/"&Take="\d*/, '&Skip='+numberOfSites);
     fetchSites();
}
document.getElementById('loadMore_button').addEventListener('click', loadMore, false);

function sendForm() {
    const name = document.getElementById('form_name').value;
    const mail = document.getElementById('form_eMail').value;
    const adress = document.getElementById('form_Site-Adress').value;
    const comment = document.getElementById('form_comment').value;
    if (name !== '' && mail !== '') {
        let message = 'name: ' + name + '; eMail: ' + mail + '; SiteAdress: ';
        if (adress !== '') message += adress;
        else message += '/';
        message += '; comment: ' + comment;
        if (comment !== '') message += comment;
        else message += '/';
        message += ';';
        chayns.intercom.sendMessageToPage({ text: message });
        document.getElementById('form_name').value = '';
        document.getElementById('form_eMail').value = '';
        document.getElementById('form_Site-Adress').value = '';
        document.getElementById('form_comment').value = '';
        document.getElementById('form_comment').className = 'accordion';
        chayns.dialog.alert('Vielen Dank für Deinen Vorschlag!', 'Dein Formula wurde versandt.');
    }
}
document.getElementById('send_button').addEventListener('click', sendForm, false);

function searchSites(event) {
    if (event.key === 'Enter') {
        sites = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=' + document.getElementById('search').value + '&Skip=0&Take=10';
        console.log(sites);
        const node = document.getElementById("sitesList");
        node.querySelectorAll('*').forEach(n => n.remove());
        fetchSites();
    }
}
document.getElementById('search').addEventListener('keydown', searchSites, false);

fetchSites();
