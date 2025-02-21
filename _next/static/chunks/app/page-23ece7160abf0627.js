(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{5830:(e,a,s)=>{Promise.resolve().then(s.bind(s,7261))},7261:(e,a,s)=>{"use strict";s.d(a,{default:()=>n});var t=s(5155),l=s(2115);function r(e){let{review:a}=e,s="https://www.youtube.com/results?search_query=".concat(encodeURIComponent(a.title+" kayak review"));return(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-md overflow-hidden",children:[(0,t.jsx)("div",{className:"p-6 bg-gray-50",children:(0,t.jsxs)("a",{href:s,target:"_blank",rel:"noopener noreferrer",className:"text-blue-600 hover:text-blue-800 hover:underline font-medium",children:["Search for ",a.title," Reviews"]})}),(0,t.jsxs)("div",{className:"p-6",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4",children:a.title}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsx)(c,{label:"Length",value:"".concat(a.specs.length," ft")}),(0,t.jsx)(c,{label:"Width",value:"".concat(a.specs.width," in")}),(0,t.jsx)(c,{label:"Weight",value:"".concat(a.specs.weight," lbs")}),(0,t.jsx)(c,{label:"Capacity",value:"".concat(a.specs.capacity," lbs")}),(0,t.jsx)(c,{label:"Material",value:a.specs.material}),(0,t.jsx)(c,{label:"Type",value:a.specs.type}),(0,t.jsx)(c,{label:"Price",value:"$".concat(a.specs.price)})]}),(0,t.jsxs)("div",{className:"mt-6 p-4 bg-gray-50 rounded-lg",children:[(0,t.jsx)("h3",{className:"text-lg font-semibold text-gray-700 mb-2",children:"Summary"}),(0,t.jsx)("p",{className:"text-gray-600 leading-relaxed",children:a.summary})]}),(0,t.jsxs)("div",{className:"mt-4 text-sm text-gray-500",children:["Reviewed: ",new Date(a.reviewDate).toLocaleDateString()]})]})]})}function c(e){let{label:a,value:s}=e;return(0,t.jsxs)("div",{className:"flex flex-col",children:[(0,t.jsx)("span",{className:"font-medium text-gray-600",children:a}),(0,t.jsx)("span",{className:"text-gray-900",children:s})]})}function n(){let[e,a]=(0,l.useState)([]),[s,c]=(0,l.useState)(!0),[n,i]=(0,l.useState)(null),[d,o]=(0,l.useState)(!1);async function x(){try{let e="/placeskayakviews",s=await fetch("".concat(e,"/data/kayaks.json"));if(console.log("Fetching from:","".concat(e,"/data/kayaks.json")),!s.ok){let e=await s.text();throw console.error("Response error:",e),Error("Failed to fetch kayak reviews: ".concat(s.status))}let t=await s.json();console.log("Received data:",t),a(t.kayaks),o("true"===s.headers.get("x-using-fallback"))}catch(s){console.error("Fetch error:",s);let e="An error occurred",a="";s instanceof Error&&(e=s.message,s.message.includes("Failed to fetch")?a="API connection failed. Please check your internet connection.":s.message.includes("Invalid response format")?a="The API returned data in an unexpected format.":s.message.includes("Invalid kayak data")&&(a="The API returned invalid kayak data.")),i({message:e,details:a}),o(!0)}finally{c(!1)}}return((0,l.useEffect)(()=>{x()},[]),s)?(0,t.jsx)("div",{className:"flex justify-center items-center min-h-[400px]",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):n?(0,t.jsxs)("div",{className:"text-center py-8",children:[(0,t.jsxs)("div",{className:"text-red-500 mb-2",children:["Error: ",n.message]}),n.details&&(0,t.jsx)("div",{className:"text-gray-600 text-sm mb-4",children:n.details}),(0,t.jsx)("button",{onClick:x,className:"mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",children:"Try Again"}),d&&e.length>0&&(0,t.jsxs)("div",{className:"mt-8",children:[(0,t.jsx)("div",{className:"text-gray-500 mb-4",children:"Showing cached data:"}),(0,t.jsxs)("div",{className:"flex flex-col gap-8",children:[e.map(e=>(0,t.jsx)(r,{review:e},e.id)),(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm mt-4 pb-4",children:"Cached data"})]})]})]}):(0,t.jsx)("div",{className:"max-w-2xl mx-auto",children:(0,t.jsxs)("div",{className:"flex flex-col gap-8",children:[e.map(e=>(0,t.jsx)(r,{review:e},e.id)),d&&(0,t.jsx)("div",{className:"text-center text-gray-500 text-sm mt-4 pb-4",children:"Cached data"})]})})}}},e=>{var a=a=>e(e.s=a);e.O(0,[441,517,358],()=>a(5830)),_N_E=e.O()}]);