"use client";

import {useState} from "react";

export default function ResetPasswordPage(){

const [password,setPassword]=useState("");
const [token,setToken]=useState("");

useEffect(()=>{

const params =
new URLSearchParams(
window.location.search
);

setToken(
params.get("token")
);

},[]);


async function reset(){

await fetch(
"https://your-api.com/auth/reset-password",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

token,
password

})
});

alert(
"Password updated"
);

}


return (

<div>

<h1>
Reset Password
</h1>


<input
type="password"
value={password}
onChange={
e=>setPassword(e.target.value)
}
/>


<button onClick={reset}>
Update Password
</button>


</div>

)

}