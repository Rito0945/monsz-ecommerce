const API=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export const API_ORIGIN=API.replace(/\/api\/?$/,'');
export async function api(path,options={}){const token=localStorage.getItem('monsz_token');const isForm=options.body instanceof FormData;const headers={...(options.headers||{})};if(!isForm)headers['Content-Type']='application/json';if(token)headers.Authorization=`Bearer ${token}`;const res=await fetch(API+path,{...options,headers});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||'Request failed');return data}
