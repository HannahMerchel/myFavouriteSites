import './app.scss';


chayns.ui.initAll();

let sites = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=30';
let numberOfSites = 30;
let time = Date.now();
let isLoading = false;

function addSite(Site) {
    const newSite = document.createElement('a');
    newSite.classList.add('site');
    // newSite.href = `https://chayns.net/${Site.siteId}/`;
    newSite.style.border = 0;
    document.getElementById('sitesList').appendChild(newSite);
    const icon = document.createElement('div');
    icon.classList.add('siteIcon');
    newSite.appendChild(icon);
    const title = document.createElement('div');
    let titleText = Site.appstoreName;
    if (titleText.length > 10) {
        titleText = titleText.substring(0, 7);
        titleText += '...';
    }
    title.textContent = titleText;
    title.classList.add('siteTitle');
    newSite.appendChild(title);

    newSite.addEventListener('click', () => { viewSite(`https://chayns.net/${Site.siteId}/`); }, false);

    fetch(`https://chayns.tobit.com/storage/${Site.siteId}/Images/icon-57.png`, { method: 'HEAD' })
    .then(() => {
        icon.style.backgroundImage = `url('https://chayns.tobit.com/storage/${Site.siteId}/Images/icon-57.png')`;
    }).catch(() => { icon.style.backgroundImage = 'url(\'https://sub60.tobit.com/l/152342?size=100\')'; });
}

function fetchSites() {
    chayns.showWaitCursor();
    isLoading = true;
    fetch(sites)
    .then(response => response.json())
    .then((data) => {
        for (const Site in data.Data) {
            if (Site !== undefined) {
                addSite(data.Data[Site]);
            }
        }
        chayns.hideWaitCursor();
        isLoading = false;
    });
}

function loadMore() {
     sites = sites.replace(/Skip=\d*/, `&Skip=${numberOfSites}`);
     numberOfSites += 30;
     fetchSites();
}
document.getElementById('loadMore_button').addEventListener('click', loadMore, false);

function sendForm() {
    const name = document.getElementById('form_name').value;
    const mail = document.getElementById('form_eMail').value;
    const adress = document.getElementById('form_Site-Adress').value;
    const comment = document.getElementById('form_comment').value;
    if (name !== '' && mail !== '') {
        let message = `Name: ${name};\n eMail: ${mail};\n SiteAdresse: `;
        if (adress !== '') message += adress;
        else message += '/';
        message += ';\n Kommentar: ';
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
    } else chayns.dialog.alert('', 'Bitte fülle noch Name und eMail aus');
}
document.getElementById('send_button').addEventListener('click', sendForm, false);

function typingInSearch() {
    time = Date.now();
    setTimeout(() => {
        if (Date.now() - time >= 1000 && document.getElementById('search').value !== '') {
            searchSites();
        }
    }, 1000);
}
function searchSites() {
    if (isLoading) {
        setTimeout(() => { searchSites(); }, 100);
    } else if (sites !== `https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${document.getElementById('search').value}&Skip=0&Take=30`) {
        sites = `https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${document.getElementById('search').value}&Skip=0&Take=30`;
        const node = document.getElementById('sitesList');
        node.querySelectorAll('*').forEach(n => n.remove());
        fetchSites();
    }
}
document.getElementById('search').addEventListener('keydown', typingInSearch, false);

function viewSite(siteAdress) {
    chayns.openUrlInBrowser(siteAdress);
    document.getElementById('sites_view_frame').src = siteAdress;
}

fetchSites();
