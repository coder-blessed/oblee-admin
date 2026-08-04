"use client";

import {
 useEffect,
 useState
} from "react";


export default function ResetPasswordPage(){

const [token,setToken]=useState("");


useEffect(()=>{

const params =
new URLSearchParams(
window.location.search
);


const resetToken =
params.get("token");


setToken(resetToken);



if(resetToken){

window.location.href =
`oblee://reset-password?token=${resetToken}`;

}


},[]);



return(

<div
style={{
padding:"40px",
textAlign:"center"
}}
>

<h1>
Opening Oblee...
</h1>

</div>

)

}