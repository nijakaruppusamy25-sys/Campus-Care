const BASE=import.meta.env.VITE_API_URL||'http://localhost:8080/api';
async function request(path,options={}){
 const token=localStorage.getItem('cc_token');
 const headers={...(options.headers||{})};
 if(token)headers.Authorization=`Bearer ${token}`;
 if(options.body&&!(options.body instanceof FormData))headers['Content-Type']='application/json';
 let response;
 try{response=await fetch(BASE+path,{...options,headers})}
 catch(error){if(error instanceof TypeError)throw new Error(`Cannot reach the Campus Care API at ${BASE}. Check that the Spring Boot backend is running.`);throw error}
 if(!response.ok){const text=await response.text();let message=text;try{const payload=JSON.parse(text);message=payload.message||payload.error||text}catch{}throw new Error(message||`Request failed (${response.status})`)}
 return response.status===204?null:response.json();
}
export const api={
 login:(email,password)=>request('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
 issues:()=>request('/issues'), createIssue:(form)=>request('/issues',{method:'POST',body:form}), vote:(id)=>request(`/issues/${id}/vote`,{method:'POST'}), status:(id,status)=>request(`/issues/${id}/status?status=${encodeURIComponent(status)}`,{method:'PATCH'}),
 assignSupervisor:(id,data)=>request(`/issues/${id}/assign-supervisor`,{method:'POST',body:JSON.stringify(data)}), reportCompletion:(id,data)=>request(`/issues/${id}/report-completion`,{method:'POST',body:JSON.stringify(data)}), resolveIssue:(id)=>request(`/issues/${id}/resolve`,{method:'POST'}),
 guests:()=>request('/guests'), createGuest:(x)=>request('/guests',{method:'POST',body:JSON.stringify(x)}), availability:(a,b)=>request(`/guests/availability?checkIn=${a}&checkOut=${b}`), approveGuest:(id,room)=>request(`/guests/${id}/approve?room=${room}`,{method:'PATCH'}), rejectGuest:(id)=>request(`/guests/${id}/reject`,{method:'PATCH'}), arrive:(id)=>request(`/guests/${id}/arrive`,{method:'PATCH'}), depart:(id)=>request(`/guests/${id}/depart`,{method:'PATCH'}),
 mess:()=>request('/mess'), updateMess:(id,items)=>request(`/mess/${id}`,{method:'PUT',body:JSON.stringify({items})}), announcements:()=>request('/announcements'), postAnnouncement:(x)=>request('/announcements',{method:'POST',body:JSON.stringify(x)}), directory:()=>request('/directory'), studentDash:()=>request('/dashboard/student'), staffDash:()=>request('/dashboard/staff'), submitFeedback:(id,data)=>request(`/issues/${id}/feedback`,{method:'POST',body:JSON.stringify(data)}), feedbackSummary:()=>request('/feedback'),
 parcels:()=>request('/parcels'), parcelStudents:()=>request('/parcels/students'), logParcel:(data)=>request('/parcels',{method:'POST',body:JSON.stringify(data)}), verifyParcelOtp:(id,otp)=>request(`/parcels/${id}/verify-otp`,{method:'POST',body:JSON.stringify({otp})}), collectParcel:(id)=>request(`/parcels/${id}/collect`,{method:'PATCH'}),
 lostItems:()=>request('/lost-items'), createLostItem:(data)=>request('/lost-items',{method:'POST',body:data instanceof FormData?data:JSON.stringify(data)}), claimLostItem:(id)=>request(`/lost-items/${id}/claim`,{method:'PATCH'}), deleteLostItem:(id)=>request(`/lost-items/${id}`,{method:'DELETE'})
};
