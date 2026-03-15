import{aP as n,d8 as l,at as t,cX as r}from"./index-v405.js";function f(e,o){const i=n(o);i.includes("ChunkLoadError")?p(e):d(e,i)}function d(e,o){const i=`
    <div style="display: flex; flex-direction: row">
      <div style="font-size: 60px; color: #d50f25; padding: 0 10px">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <div style="padding: 10px">
        ${e("app.An error occurred",{link:'<a href="https://old.wheelofnames.com">old.wheelofnames.com</a>'})}
        <br><br>
        <i>${o}</i>
      </div>
    </div>
  `;l.create({title:"Oops!",message:i,html:!0,ok:{label:e("common.Close"),unelevated:"",color:"primary",noCaps:""}})}function v(e,o){const a=`
    <div style="display: flex; flex-direction: row; align-items: center">
      <div style="font-size: 60px; color: #d50f25; padding: 0 10px">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <div style="padding: 10px">
        ${n(o)}
      </div>
    </div>
  `;l.create({title:"Oops!",message:a,html:!0,ok:{label:e("common.Close"),unelevated:"",color:"primary",noCaps:""}})}function u(e,o,i=()=>{}){const a=`
    <div style="display: flex; flex-direction: row; align-items: center">
      <div style="font-size: 60px; color: #21BA45; padding: 0 10px">
        <i class="fas fa-circle-check"></i>
      </div>
      <div style="padding: 10px; font-size: 1.2em">
        ${o}
      </div>
    </div>
  `;l.create({message:a,html:!0,ok:{label:e("common.OK"),unelevated:"",color:"primary",noCaps:""}}).onOk(i)}function y(e,o){const i=`
    <div style="display: flex; flex-direction: row">
      <div style="font-size: 60px; color: #f2c037; padding: 0 10px">
        <i class="fas fa-question-circle"></i>
      </div>
      <div style="padding: 10px">
        ${o}
      </div>
    </div>
  `;return new Promise(a=>{l.create({title:e("app.Confirm"),message:i,html:!0,ok:{label:e("common.OK"),unelevated:"",color:"primary",noCaps:""},cancel:{label:e("common.Cancel"),flat:"",noCaps:""}}).onOk(()=>a(!0)).onCancel(()=>a(!1))})}function g(e,o,i){const a=`
    <div style="display: flex; flex-direction:row;">
      <div style="font-size:60px; color:#f2c037; padding: 0 10px">
        <i class="fas fa-question-circle"></i>
      </div>
      <div style="padding: 10px">
        ${o}
      </div>
    </div>
  `;l.create({title:e("app.Confirm"),message:a,html:!0,ok:{label:e("common.OK"),unelevated:"",color:"primary",noCaps:""},cancel:{label:e("common.Cancel"),flat:"",noCaps:""}}).onOk(()=>i())}function x(e,o,i){const a=`
    <div style="display: flex">
      <div style="font-size:60px; color:#3369e8; padding: 0 10px">
        <i class="fas fa-question-circle"></i>
      </div>
      <div style="padding: 10px">
        ${i}
      </div>
    </div>
  `;return new Promise(s=>{l.create({title:o,message:a,html:!0,ok:{label:e("optionsdialog.Yes"),unelevated:"",color:"primary",noCaps:""},cancel:{label:e("optionsdialog.No"),unelevated:"",color:"primary",noCaps:""}}).onOk(()=>s(!0)).onCancel(()=>s(!1))})}function h(e,o,i,a){const s=`
    <div style="display: flex">
      <div style="font-size:60px; color:#3369e8; padding: 0 10px">
        <i class="fas fa-question-circle"></i>
      </div>
      <div style="padding: 10px">
        ${o}
      </div>
    </div>
  `;l.create({title:e,message:s,html:!0,ok:{label:a.label,unelevated:"",color:"primary",noCaps:""},cancel:{label:i.label,unelevated:"",color:"primary",noCaps:""}}).onOk(a.callback).onCancel(i.callback)}function p(e){const o=`
    <div style="display: flex; flex-direction: row">
      <div style="font-size: 60px; color: #3369e8; padding: 0 10px">
        <i class="fas fa-info-circle"></i>
      </div>
      <div style="padding: 10px">
        ${e("app.There is a new version")}
      </div>
    </div>
  `;l.create({title:e("app.New version available"),message:o,html:!0,ok:{label:e("common.Reload"),unelevated:"",color:"primary",noCaps:""},cancel:{label:e("common.Cancel"),flat:"",noCaps:""}}).onOk(()=>location.reload())}function C(e){t.create({message:e,position:c(),actions:[{icon:"fas fa-times",color:"white"}]})}function b(e,o,i){t.create({message:o,position:c(),timeout:7e3,actions:[{label:e("common.Undo"),color:"white",noCaps:!0,handler:i},{icon:"fas fa-times",color:"white"}]})}function w(e){t.create({message:n(e),position:c(),color:"negative",icon:"fas fa-exclamation-triangle"})}function c(){return r.is.mobile?"top":"bottom"}export{v as a,f as b,y as c,w as d,b as e,u as f,g,h as m,C as s,x as y};
