const src1 = "/assets/bot.png"
const src2 = "/assets/user.png"
// import bot from './assets/bot.svg'
// import user from './assets/user.svg'


const form = document.querySelector('form')
const chatcontainer = document.querySelector('#chat_container')

let interval;

const loader= (element)=>{
  element.textContent ='';

  interval = setInterval(()=>{

    element.textContent +='.';

    if(element.textContent === '......'){
      element.textContent ='';
    }
  },300)
}

const textType = (element, text )=>{
  let index =0;

  let loadInterval = setInterval (()=>{
    if(index< text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(loadInterval)
    }
  },20)
}

function generateUniqueId() {
  const timestamp = Date.now()
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`;
}
// console.log(generateUniqueId());

function chatStripe(isAI, value , uniqueId){

  return(
    `
    <div class="wrapper ${ isAI && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src=${ isAI ? src1 : src2}
          alt='${isAI? 'Bot' : 'User'}'/>
        </div>
        <div class="message" id='${uniqueId}'>${value}</div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) =>{
  e.preventDefault();

  const formData = new FormData(form);

  //User's chatstripe
  chatcontainer.innerHTML += chatStripe(false, formData.get('prompt'));
  form.reset();

  //Ai's ChatStripe
  const uniqueId = generateUniqueId()
  chatcontainer.innerHTML += chatStripe(true, "", uniqueId);

  chatcontainer.scrollTop = chatcontainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);  

  const response = await fetch('http://localhost:5000',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: formData.get('prompt')
    })
  })

  clearInterval(interval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const res = await response.json();
    const parsedata = res.bot.trim()
    textType(messageDiv, parsedata)
  } else {
    const err = await response.text()
    messageDiv.innerHTML = "Something Went Wrong";

    alert(err)
  }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e)=>{
  if(e.key === 'Enter'){
   handleSubmit(e);
   console.log("Heloo")
  }
})