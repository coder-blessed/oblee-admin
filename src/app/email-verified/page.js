"use client";

import { useEffect, useState } from "react";


export default function EmailVerifiedPage(){

const [openApp,setOpenApp] = useState(false);


function openOblee(){

window.location.href =
"oblee://login";

}


return (

<div
style={{
minHeight:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#f8fafc",
fontFamily:"Arial, sans-serif",
padding:"20px"
}}
>


<div
style={{
background:"white",
width:"100%",
maxWidth:"420px",
borderRadius:"24px",
padding:"40px 30px",
textAlign:"center",
boxShadow:"0 10px 40px rgba(0,0,0,0.08)"
}}
>


<div
style={{
width:"80px",
height:"80px",
borderRadius:"50%",
background:"#16a34a",
display:"flex",
alignItems:"center",
justifyContent:"center",
margin:"0 auto 25px",
fontSize:"40px",
color:"white"
}}
>
✓
</div>


<h1
style={{
fontSize:"28px",
marginBottom:"15px",
color:"#111827"
}}
>
Email Verified
</h1>


<p
style={{
color:"#6b7280",
fontSize:"16px",
lineHeight:"1.6"
}}
>
Your Oblee account has been successfully verified.
You can now login and start using Oblee.
</p>


<button
onClick={openOblee}
style={{
marginTop:"30px",
width:"100%",
padding:"16px",
borderRadius:"12px",
border:"none",
background:"#111827",
color:"white",
fontSize:"16px",
cursor:"pointer"
}}
>
Open Oblee App
</button>


<a
href="https://oblee.app/login"
style={{
display:"block",
marginTop:"20px",
color:"#2563eb",
textDecoration:"none"
}}
>
Continue on Web
</a>


</div>


</div>

);


}