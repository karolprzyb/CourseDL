
function clickDownloadTab()
{
    console.log("Clicking that download tab!")
    myId = document.querySelector('[id$="tab-DOWNLOADS"]').id;
    document.getElementById(myId).click();
}

function downloadVidAndSub()
{
    //We have to get what week is on the page
    var headings = document.evaluate("//a/span[contains(., 'Week')]", document, null, XPathResult.ANY_TYPE, null );
    var thisHeading = headings.iterateNext();
    var weekNum = "2000"; // This is an erro state if not changed
    if(thisHeading === null)
    {
        console.log("Somethign is wrong. No week extracted from page!");
    }
    else
    {
        weekNum = thisHeading.innerText.substring(5,7).trim();
    }

    // We can also add folder grouping based on the left side tab headings from this
    let groupings = document.evaluate("//li/div[attribute::class=\"rc-CollapsibleLesson\"]", document, null, XPathResult.ANY_TYPE, null );
    let subFolderName = '';
    let numSubsection = 1;
    let elemExpanded = groupings.iterateNext();
    while(!(elemExpanded === null))
    {
        if (elemExpanded.children[0].children[0].getAttribute('aria-expanded') ==='true')
        {
            subFolderName = elemExpanded.children[0].children[0].innerText;
            subFolderName = subFolderName.replaceAll(" ", "_");
            subFolderName += '/';
            break;
        }
        elemExpanded = groupings.iterateNext();
        numSubsection++;
    }

    if(subFolderName != '')
    {
        subFolderName = numSubsection.toString() + "-" + subFolderName;
    }

    myIdPanel = document.querySelector('[id$="panel-DOWNLOADS"]').id;
    childList = document.getElementById(myIdPanel).children[0].children;
    var videoname;
    for(var tChild of childList)
    {
        console.log(subFolderName);

        filename = tChild.children[0].getAttribute("download");
        mpIdx = filename.indexOf('.mp4');
        vtIdx = filename.indexOf('.vtt');
        var link = tChild.children[0].getAttribute("href");

        if(mpIdx != -1)
        {
            videoname = filename.substring(0,mpIdx);
            // Check if link has 720p in it, if yes, send link to extension to download and week number
            if(link.includes("720p"))
            {
                chrome.runtime.sendMessage([weekNum, link, videoname, "mp4", subFolderName], function(response){console.log("Response: ",response)})
            }
        }
        if(vtIdx != -1)
        {
            // Send download link for vtt to extension and week number
            chrome.runtime.sendMessage([weekNum, "https://www.coursera.org" + link, videoname, "vtt", subFolderName])
        }
    }
}

function runDelayed()
{
    if(document.querySelector('[id$="tab-DOWNLOADS"]') === null)
    {
        setTimeout(() => {
            runDelayed();
        }, 1000);
    }
    else
    {
        clickDownloadTab();
        downloadVidAndSub();
    }
}

function run()
{
    setTimeout(() => {

        runDelayed();
    }, 2000);
}

run()

//document.addEventListener("DOMContentLoaded", run);