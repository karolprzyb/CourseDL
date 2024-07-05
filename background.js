
let videoNum = Array(20).fill(0);
let cantTouchThis = 'ThisIsABeat';

function checkHammerTime(message)
{
  if(cantTouchThis == 'YouCantTouch')
  {
    // Check if Hammer Time again in 200ms
    setTimeout(checkHammerTime, 200, message);
  }
  else
  {
    cantTouchThis = 'YouCantTouch';
    loadStorage().then(() => {handleMessage(message)}).then(() => {
      cantTouchThis = 'ThisIsABeat';
    }).catch(e => console.log("Error in background script " + e));
  }
}

async function loadStorage()
{
  let tempNum = await chrome.storage.local.get('videoNum');
  if(tempNum['videoNum'] === undefined)
  {
    chrome.storage.local.set({'videoNum':JSON.stringify(videoNum)}).then(() => {
      cantTouchThis='ThisIsABeat';
    }).catch(e => console.log("Error in INIT setting local storage " + e));
    console.log("Nothing in local storage!!! Init with default values (0)")
  }
  else
  {
    videoNum = JSON.parse(tempNum['videoNum']);
  }
}

function handleMessage(message)
{
  const week = message[0];
  const myUrl = message[1];
  const vidName = message[2];
  const fileType = message[3];
  const subFolderName = message[4];

  if(fileType !== "vtt")
  {
    videoNum[Number(week)]++;
  }

  chrome.storage.local.set({'videoNum':JSON.stringify(videoNum)}).then(() => {
    cantTouchThis='ThisIsABeat';
  }).catch(e => console.log("Error in setting local storage " + e));

  var zeroPad = "";
  if(videoNum[Number(week)] < 10)
  {
    zeroPad = "0";
  }

  console.log(fileType)
  console.log(message[2])
  console.log("GOT ONE!")

  newVidName = vidName.replace(/[/\\?%*:|"<>]/g, '-');

  chrome.downloads.download({
    conflictAction: "overwrite",
    filename: "Week " + week + "/" + subFolderName + "video" + zeroPad + videoNum[Number(week)].toString() + " " + newVidName  + "." + fileType,
    url: myUrl,
  });
}

chrome.runtime.onMessage.addListener(
    function(message) {
      checkHammerTime(message);
      
      //sendResponse("GOT THE MESSAGE; DOWNLOADED")
});