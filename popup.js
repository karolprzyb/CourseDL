let videoNum = Array(20).fill(0);
let dropdownElem, inputElem, statusElem, setVidNumButtonElem, resetVidNumButtonElem;

window.addEventListener("load", initSettingsPage);

function initSettingsPage()
{
    // Init all refs
    console.log("Load fired")
    dropdownElem = document.getElementById("vidWeekNumDropdown");
    inputElem = document.getElementById("vidNumber");
    statusElem = document.getElementById("actionStatus");
    setVidNumButtonElem = document.getElementById("updateVidNumberButton");
    setVidNumButtonElem.addEventListener("click", updateVidNumberStorage);
    resetVidNumButtonElem = document.getElementById("resetVidNumberButton");
    resetVidNumButtonElem.addEventListener("click", resetVidNumberStorage);
    dropdownElem.addEventListener("change", updateVidNumberDisp);
    // Now that we are sure we have the correct references post loading we can start
    loadStorage().then(()=>{
        videoNum.forEach((_, weekIndex) => {
            const tempNewElement = document.createElement("option");
            tempNewElement.value = weekIndex;
            tempNewElement.text = "Week " + weekIndex.toString();
            dropdownElem.append(tempNewElement)
        });
        if(dropdownElem.hasChildNodes())
        {
            dropdownElem.value = dropdownElem.firstChild.value;
            inputElem.value = videoNum[dropdownElem.value];
        }
    });
}

function updateVidNumberDisp()
{
    inputElem.value = videoNum[dropdownElem.value];
}

function updateVidNumberStorage()
{
    videoNum[dropdownElem.value] = inputElem.value;
    setStorage();
}

function resetVidNumberStorage()
{
    if(confirm("Are you sure? This will reset video numbers for all weeks to zero!"))
    {
        videoNum.fill(0);
        inputElem.value = 0;
        setStorage();
    }
}

function setStorage()
{
    chrome.storage.local.set({'videoNum':JSON.stringify(videoNum)}).then(()=>{
        statusElem.innerText = "Status: Write to storage success!";
        setTimeout(revertStatus, 3000);
    }).catch(e=>{
        statusElem.innerText = "Status: ERROR WRITING TO STORAGE - " + e;
    });
}

function revertStatus()
{
    statusElem.innerText = "Status: waiting";
}

async function loadStorage()
{
  let tempNum = await chrome.storage.local.get('videoNum');
  if(tempNum['videoNum'] === undefined)
  {
    console.log("Nothing in local storage! Dropdown will remain empty.");
  }
  else
  {
    videoNum = JSON.parse(tempNum['videoNum']);
  }
}