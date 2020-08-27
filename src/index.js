import './app.scss';


chayns.ui.initAll();

let sites = 'https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=love&Skip=0&Take=30';
let numberOfSites = 30;
let isLoading = false;
let timeout;
let newList;

function addSite(Site, sitesList) {
    const newSite = document.createElement('button');
    newSite.classList.add('site');
    newSite.style.border = 0;
    sitesList.appendChild(newSite);
    const icon = document.createElement('div');
    icon.classList.add('siteIcon');
    newSite.appendChild(icon);
    const title = document.createElement('div');
    let titleText = Site.appstoreName;
    if (titleText.length > 9) {
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

function fetchSites(sitesList) {
    chayns.showWaitCursor();
    isLoading = true;
    fetch(sites)
    .then(response => response.json())
    .then((data) => {
        for (const Site in data.Data) {
            if (Site !== undefined) {
                addSite(data.Data[Site], sitesList);
            }
        }
        chayns.hideWaitCursor();
        isLoading = false;
        if (newList !== undefined) {
            document.getElementById('sitesList').remove();
            document.getElementById('list_container').appendChild(newList);
            newList.style.display = 'flex';
            newList.id = 'sitesList';
            newList = undefined;
            // replace old list with new
        }
    });
}

function loadMore() {
     sites = sites.replace(/Skip=\d*/, `&Skip=${numberOfSites}`);
     numberOfSites += 30;
     fetchSites(document.getElementById('sitesList'));
}
document.getElementById('loadMore_button').addEventListener('click', loadMore, false);

function sendForm() {
    const name = document.getElementById('form_name').value;
    const mail = document.getElementById('form_eMail').value;
    const adress = document.getElementById('form_Site-Adress').value;
    const comment = document.getElementById('form_comment').value;
    if (name !== '' && mail !== '') {
        let message = `Formular von My Favourite Site:\nName: ${name};\n eMail: ${mail};\n SiteAdresse: `;
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
    } else {
        let message = 'Bitte füge noch';
        if (name === '' && mail !== '') message += ' einen Name';
        else if (name !== '' && mail === '') message += ' eine eMail';
        else message += ' einen Name und eine eMail';
        message += ' hinzu.';
        chayns.dialog.alert('Formular unvollständig', message);
    }
}
document.getElementById('send_button').addEventListener('click', sendForm, false);

function typingInSearch() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        searchSites();
    }, 500);
}
function searchSites() {
    if (isLoading) {
        setTimeout(() => { searchSites(); }, 100);
    } else if (document.getElementById('search').value.match(/\S/).length !== 0 && sites !== `https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${document.getElementById('search').value}&Skip=${numberOfSites}&Take=30`) {
        sites = `https://chayns1.tobit.com/TappApi/Site/SlitteApp?SearchString=${document.getElementById('search').value}&Skip=0&Take=30`;
        newList = document.createElement('div');
        newList.classList.add('sitesList');
        newList.style.display = 'none';
        fetchSites(newList);
        document.getElementById('list_container').appendChild(newList);
    }
}
document.getElementById('search').addEventListener('keydown', typingInSearch, false);

function viewSite(siteAdress) {
    chayns.openUrlInBrowser(siteAdress);
    document.getElementById('sites_view_frame').src = siteAdress;
}

fetchSites(document.getElementById('sitesList'));
