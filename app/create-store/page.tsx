"use client"

import { useState } from "react"

export default function CreateStorePage() {

const [step,setStep]=useState(1)

const [storeName,setStoreName]=useState("")
const [subdomain,setSubdomain]=useState("")
const [description,setDescription]=useState("")

const [ownerName,setOwnerName]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")

const [logo,setLogo]=useState<File|null>(null)
const [banner,setBanner]=useState<File|null>(null)

const [logoPreview,setLogoPreview]=useState("")
const [bannerPreview,setBannerPreview]=useState("")

const [loading,setLoading]=useState(false)
const [error,setError]=useState("")
const [success,setSuccess]=useState("")

const next=()=>setStep(step+1)
const prev=()=>setStep(step-1)

function handleLogo(e:any){
const file=e.target.files?.[0]
if(!file)return
setLogo(file)
setLogoPreview(URL.createObjectURL(file))
}

function handleBanner(e:any){
const file=e.target.files?.[0]
if(!file)return
setBanner(file)
setBannerPreview(URL.createObjectURL(file))
}

async function handleSubmit(e:any){

e.preventDefault()

setLoading(true)
setError("")
setSuccess("")

try{

const formData=new FormData()

formData.append("storeName",storeName)
formData.append("subdomain",subdomain)
formData.append("description",description)

formData.append("ownerName",ownerName)
formData.append("email",email)
formData.append("password",password)

formData.append("plan","basic")
formData.append("themeKey","beauty-test")

if(logo)formData.append("logo",logo)
if(banner)formData.append("banner",banner)

const res=await fetch("/api/tenants/create",{
method:"POST",
body:formData
})

const data=await res.json()

if(!res.ok){
setError(data.error||"Failed to create store")
}else{
setSuccess(`Store created! Visit: ${data.tenant.subdomain}`)
}

}catch(err){
setError("Something went wrong")
}finally{
setLoading(false)
}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-50">

<div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">

<h1 className="text-2xl font-bold mb-6 text-center">
Create Your Store
</h1>

{/* progress */}

<div className="flex justify-between mb-8 text-sm">

<div className={step>=1?"font-bold":"text-gray-400"}>
Store
</div>

<div className={step>=2?"font-bold":"text-gray-400"}>
Owner
</div>

<div className={step>=3?"font-bold":"text-gray-400"}>
Branding
</div>

</div>

{error&&<p className="text-red-500 mb-3">{error}</p>}
{success&&<p className="text-green-600 mb-3">{success}</p>}

<form onSubmit={handleSubmit} className="space-y-5">

{/* STEP 1 */}

{step===1&&(

<div className="space-y-4">

<input
placeholder="Store Name"
value={storeName}
onChange={(e)=>setStoreName(e.target.value)}
className="w-full border p-3 rounded"
/>

<div className="flex items-center">

<input
placeholder="Subdomain"
value={subdomain}
onChange={(e)=>setSubdomain(e.target.value)}
className="w-full border p-3 rounded-l"
/>

<span className="bg-gray-100 border border-l-0 p-3 rounded-r text-sm">
.localhost:3000
</span>

</div>

<textarea
placeholder="Store description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="w-full border p-3 rounded"
/>

</div>

)}

{/* STEP 2 */}

{step===2&&(

<div className="space-y-4">

<input
placeholder="Owner Name"
value={ownerName}
onChange={(e)=>setOwnerName(e.target.value)}
className="w-full border p-3 rounded"
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border p-3 rounded"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border p-3 rounded"
/>

</div>

)}

{/* STEP 3 */}

{step===3&&(

<div className="space-y-5">

<div>

<label className="text-sm font-medium">
Store Logo
</label>

<input type="file" accept="image/*" onChange={handleLogo}/>

{logoPreview&&(
<img
src={logoPreview}
className="mt-3 h-16 object-contain"
/>
)}

</div>

<div>

<label className="text-sm font-medium">
Store Banner
</label>

<input type="file" accept="image/*" onChange={handleBanner}/>

{bannerPreview&&(
<img
src={bannerPreview}
className="mt-3 h-24 w-full object-cover rounded"
/>
)}

</div>

<p className="text-sm text-gray-500">
Your store will start with the Beauty theme.
You can customize it later in the dashboard.
</p>

</div>

)}

{/* buttons */}

<div className="flex justify-between pt-4">

{step>1&&(
<button
type="button"
onClick={prev}
className="px-4 py-2 border rounded"
>
Back
</button>
)}

{step<3&&(
<button
type="button"
onClick={next}
className="ml-auto bg-black text-white px-5 py-2 rounded"
>
Continue
</button>
)}

{step===3&&(
<button
type="submit"
disabled={loading}
className="ml-auto bg-black text-white px-5 py-2 rounded"
>
{loading?"Creating...":"Create Store"}
</button>
)}

</div>

</form>

</div>

</div>

)

}