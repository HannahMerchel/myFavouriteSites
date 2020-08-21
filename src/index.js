import './app.scss';


 chayns.ui.initAll();

 let sites = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=10';
 let numberOfSites = 10;

 function addSite(Site) {
    const newSite = document.createElement('div');
    newSite.classList.add('site');
    document.getElementById('sitesList').appendChild(newSite);
    const icon = document.createElement('div');
    icon.classList.add('siteIcon');
    newSite.appendChild(icon);
    const title = document.createElement('a');
    let titleText = Site.appstoreName;
    if (titleText.length > 15) {
        titleText = titleText.substring(0, 15);
        titleText += '...';
    }
    title.textContent = titleText;
    title.href = 'http://chayns.net/' + Site.siteId + '/';
    title.classList.add('siteTitle');
    newSite.appendChild(title);
    
    fetch('https://chayns.tobit.com/storage/' + Site.siteId + '/Images/icon-57.png', { method: 'HEAD' })
    .then((res) => {
        icon.style.backgroundImage = 'url(\'https://chayns.tobit.com/storage/' + Site.siteId + '/Images/icon-57.png\')';
    }).catch((err) => { icon.style.backgroundImage = 'url(\'https://sub60.tobit.com/l/152342?size=57\')'; });
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
     console.log(sites);
     fetchSites();
 }
 document.getElementById('loadMore_button').addEventListener('click', loadMore, false);

function sendForm() {
    const name = document.getElementById('form_name').value;
    const mail = document.getElementById('form_eMail').value;
    const adress = document.getElementById('form_Site-Adress').value;
    const comment = document.getElementById('form_comment').value;
    if (name !== '' && mail !== '') {
        chayns.intercom.sendMessageToPage({ text: 'name: ' + name + ' eMail: ' + mail + ' SiteAdress: ' + adress + ' comment: ' + comment });
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

