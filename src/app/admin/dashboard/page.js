"use client";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  TrendingUp,
  UserPlus,
  Car,
  Star,
  DollarSign,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Dashboard() {

  const router = useRouter();


  const [loading,setLoading] =
    useState(true);


  const [sidebar,setSidebar] =
    useState(false);



  useEffect(()=>{

    const token =
      localStorage.getItem(
        "admin_token"
      );


    if(!token){

      router.replace(
        "/admin/login"
      );

      return;

    }


    setLoading(false);


  },[router]);



  function logout(){

    localStorage.removeItem(
      "admin_token"
    );

    router.replace(
      "/admin/login"
    );

  }




  if(loading){

    return (

      <div className="
      min-h-screen 
      bg-black 
      text-white 
      flex 
      items-center 
      justify-center
      ">

        Loading dashboard...

      </div>

    );

  }



return (

<div className="
min-h-screen 
bg-black 
text-white 
flex
">



{/* MOBILE OVERLAY */}

{
sidebar && (

<div
onClick={()=>setSidebar(false)}
className="
fixed
inset-0
bg-black/70
z-30
lg:hidden
"
/>

)

}




{/* SIDEBAR */}

<aside
className={`
fixed
lg:static
z-40
top-0
left-0
h-screen
w-72
bg-[#0d0d0d]
border-r
border-zinc-800
p-6
transition-transform
duration-300

${sidebar 
? "translate-x-0"
: "-translate-x-full lg:translate-x-0"}

`}
>


<div className="
flex
items-center
justify-between
mb-10
">


<div className="
flex
items-center
gap-3
">


<div className="
w-12
h-12
rounded-xl
bg-[#66DDAA]
flex
items-center
justify-center
">


<Shield
size={26}
color="black"
/>


</div>



<div>

<h1 className="
font-bold
text-xl
">

Oblee

</h1>

<p className="
text-xs
text-gray-500
">

Admin Panel

</p>

</div>



</div>



<button
className="lg:hidden"
onClick={()=>setSidebar(false)}
>

<X/>

</button>


</div>





<nav className="
space-y-2
">


<NavItem
icon={<LayoutDashboard/>}
text="Dashboard"
active
/>


<NavItem
icon={<Users/>}
text="Users"
/>


<NavItem
icon={<CalendarDays/>}
text="Bookings"
/>


<NavItem
icon={<CreditCard/>}
text="Payments"
/>


<NavItem
icon={<Car/>}
text="Listings"
/>


<NavItem
icon={<Star/>}
text="Reviews"
/>


<NavItem
icon={<Settings/>}
text="Settings"
/>


</nav>





<div className="
absolute
bottom-6
left-6
right-6
">


<button
onClick={logout}
className="
w-full
flex
items-center
gap-3
px-4
py-3
rounded-xl
bg-red-500/10
text-red-400
hover:bg-red-500/20
"
>


<LogOut size={20}/>

Logout


</button>


</div>


</aside>







{/* MAIN */}

<main className="
flex-1
p-6
lg:p-10
">





{/* HEADER */}


<header className="
flex
items-center
justify-between
mb-10
">


<div className="
flex
items-center
gap-4
">


<button
onClick={()=>setSidebar(true)}
className="
lg:hidden
"
>

<Menu/>

</button>



<div>


<h2 className="
text-3xl
font-bold
">

Dashboard

</h2>


<p className="
text-gray-400
mt-1
">

Welcome back, Super Admin

</p>


</div>



</div>






<div className="
flex
items-center
gap-5
">


<div className="
hidden
md:flex
items-center
bg-[#111]
border
border-zinc-800
rounded-xl
px-4
py-3
gap-3
">


<Search
size={18}
className="text-gray-500"
/>


<input

placeholder="Search..."

className="
bg-transparent
outline-none
text-sm
"

/>


</div>





<Bell
className="
text-gray-400
"
/>




<div className="
w-11
h-11
rounded-full
bg-[#66DDAA]
text-black
flex
items-center
justify-center
font-bold
">

A

</div>


</div>


</header>







{/* STAT CARDS */}


<section className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
">



<StatCard
title="Total Users"
value="12,540"
icon={<Users/>}
growth="+12%"
/>


<StatCard
title="Bookings"
value="3,482"
icon={<CalendarDays/>}
growth="+8%"
/>


<StatCard
title="Revenue"
value="$84,230"
icon={<DollarSign/>}
growth="+18%"
/>


<StatCard
title="Active Listings"
value="942"
icon={<Car/>}
growth="+5%"
/>


</section>







{/* LOWER GRID */}


<section className="
grid
grid-cols-1
xl:grid-cols-3
gap-6
mt-8
">





{/* REVENUE */}


<div className="
xl:col-span-2
bg-[#111]
border
border-zinc-800
rounded-2xl
p-6
">


<div className="
flex
justify-between
mb-6
">


<div>

<h3 className="
text-xl
font-bold
">

Revenue Overview

</h3>


<p className="
text-gray-500
text-sm
">

Monthly performance

</p>


</div>



<TrendingUp
className="
text-[#66DDAA]
"
/>


</div>





<div className="
h-56
flex
items-end
gap-4
">


{
[40,60,45,80,70,90,65].map(
(h,i)=>(

<div
key={i}
className="
flex-1
bg-[#66DDAA]
rounded-t-lg
opacity-80
"
style={{
height:`${h}%`
}}
/>

)

)
}


</div>


</div>







{/* ACTIVITY */}


<div className="
bg-[#111]
border
border-zinc-800
rounded-2xl
p-6
">


<h3 className="
font-bold
text-xl
mb-6
">

Recent Activity

</h3>



<Activity
text="New user registered"
/>


<Activity
text="Booking completed"
/>


<Activity
text="Payment received"
/>


<Activity
text="New listing added"
/>


</div>



</section>







{/* QUICK ACTIONS */}



<section className="
mt-8
bg-[#111]
border
border-zinc-800
rounded-2xl
p-6
">


<h3 className="
text-xl
font-bold
mb-5
">

Quick Actions

</h3>


<div className="
grid
grid-cols-1
md:grid-cols-3
gap-4
">


<Action
icon={<UserPlus/>}
text="Create Admin"
/>


<Action
icon={<CalendarDays/>}
text="View Bookings"
/>


<Action
icon={<CreditCard/>}
text="Manage Payments"
/>


</div>


</section>



</main>


</div>


);


}







function NavItem({
icon,
text,
active
}){


return (

<button
className={`
w-full
flex
items-center
gap-4
px-4
py-3
rounded-xl
transition

${
active
?
"bg-[#66DDAA] text-black"
:
"text-gray-400 hover:bg-zinc-900"
}

`}
>


{icon}

<span>

{text}

</span>


</button>


)

}





function StatCard({
title,
value,
icon,
growth
}){


return (

<div className="
bg-[#111]
border
border-zinc-800
rounded-2xl
p-6
">


<div className="
flex
justify-between
">


<div>

<p className="
text-gray-500
text-sm
">

{title}

</p>


<h2 className="
text-3xl
font-bold
mt-3
">

{value}

</h2>


<p className="
text-[#66DDAA]
text-sm
mt-2
">

{growth}

</p>


</div>


<div className="
w-12
h-12
rounded-xl
bg-[#66DDAA]/20
flex
items-center
justify-center
text-[#66DDAA]
">

{icon}

</div>


</div>


</div>


)

}





function Activity({
text
}){


return (

<div className="
flex
items-center
gap-3
mb-4
">


<div className="
w-2
h-2
rounded-full
bg-[#66DDAA]
"/>


<p className="
text-gray-400
">

{text}

</p>


</div>

)


}





function Action({
icon,
text
}){


return (

<button
className="
flex
items-center
gap-3
bg-zinc-900
hover:bg-zinc-800
rounded-xl
p-4
transition
"
>

{icon}

{text}

</button>

)

}