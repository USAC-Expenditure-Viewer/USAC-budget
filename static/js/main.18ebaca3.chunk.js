(this.webpackJsonpbudget_wc=this.webpackJsonpbudget_wc||[]).push([[0],{175:function(t,e,a){},289:function(t,e,a){t.exports=a(484)},294:function(t,e,a){},308:function(t,e){},484:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),i=a(16),o=a.n(i),l=(a(294),a(23)),s=a(20),u=a(29),c=a(28),d=(a(175),a(534)),h=a(535),m=a(554),g=a(538),f=a(98),p=a(539),v=a(557),y=a(540),b=a(558),k=a(541),E=a(542),C=a(231),w=a.n(C),x=a(118),O=a.n(x),S=a(232),j=a.n(S),D=a(85),M=function(){function t(){Object(l.a)(this,t),this.queryString=void 0,this.generators=new Map,this.queryString=window.location.search.replace("?","")}return Object(s.a)(t,null,[{key:"getInstance",value:function(){return null===this.instance&&(this.instance=new t),this.instance}}]),Object(s.a)(t,[{key:"getQuery",value:function(){return this.queryString}},{key:"addGenerator",value:function(t,e){this.generators.set(e,t)}},{key:"update",value:function(){var t=Object(D.a)(this.generators.values()).map((function(t){return t()})).join("&"),e=window.location.href;e.includes("?")&&(e=e.substr(0,e.indexOf("?"))),window.history.pushState({path:e+"?"+t},"",e+"?"+t)}}]),t}();M.instance=null;var W=a(42),N=a(33);function F(t){if(Number.isNaN(t))return"";var e="";return Math.abs(t)>=1e9?(e="B",t/=1e9):Math.abs(t)>=1e6?(e="M",t/=1e6):Math.abs(t)>=1e3&&(e="K",t/=1e3),t.toPrecision(3)+e}function I(t){var e=1;return t.includes("K")&&(e=1e3,t=t.replace("K","")),t.includes("M")&&(e=1e6,t=t.replace("M","")),t.includes("B")&&(t=t.replace("B",""),e=1e9),Number.parseFloat(t)*e}var L=a(225),A=function(){function t(e){Object(l.a)(this,t),this.data=[],this.filters=[],this.dataChangeCallbacks=[],this.total_amount=0,this.setDataset(e)}return Object(s.a)(t,[{key:"setDataset",value:function(t){this.sliceFilter(0),this.loadDataset(t)}},{key:"loadDataset",value:function(t){var e=this;null!==t&&L.parse(window.location.pathname+"/expense_summary_"+t+".csv",{download:!0,header:!0,complete:function(t){e.data=t.data.map((function(t){return t.date=new Date(1e3*Number.parseFloat(t.date)),t.amount=Number.parseFloat(t.amount),t.words=t.__parsed_extra||[],t})).filter((function(t){return!Number.isNaN(t.amount)})),e.onLoad()}})}},{key:"onLoad",value:function(){this.total_amount=this.data.reduce((function(t,e){return t+e.amount}),0),this.parseQuery(M.getInstance().getQuery()),M.getInstance().addGenerator(this.generateQueryString.bind(this),2),this.listChangeCallback()}},{key:"parseQuery",value:function(t){var e=this;"?"===t[0]&&(t=t.slice(1));var a=this.dataChangeCallbacks;this.dataChangeCallbacks=[];try{t.split("&").forEach((function(t){if(t.includes("=")){var a=t.indexOf("="),n=t.substr(0,a),r=t.substr(a+1);switch(n){case"keyword":e.addKeywordFilter(r);break;case"fund":case"division":case"department":case"gl":case"event":e.addCategoryFilter(n,atob(r));break;case"amount":if(!r.includes(".."))return;var i=r.split("..").map((function(t){return I(t)}));e.addAmountFilter(i[0],i[1]);break;case"date":if(!r.includes(".."))return;var o=r.split("..");e.addMonthFilter(o[0],o[1])}}}))}catch(n){console.log(n)}this.dataChangeCallbacks=a}},{key:"generateQueryString",value:function(){return this.filters.map((function(t){switch(t.category){case"keyword":return"keyword="+t.name;case"amount":return"amount="+t.name.replace("~","..");case"date":return"date="+t.name.replace("~","..");default:return t.category+"="+btoa(t.name)}})).join("&")}},{key:"listChangeCallback",value:function(){this.dataChangeCallbacks.forEach((function(t){return t()})),M.getInstance().update()}},{key:"addChangeCallback",value:function(t){this.dataChangeCallbacks.push(t)}},{key:"getRecords",value:function(){return 0===this.data.length?[]:0===this.filters.length?this.data:this.filters[this.filters.length-1].index}},{key:"getWordList",value:function(){if(0===this.data.length)return[];var t=new Map;this.getRecords().forEach((function(e){e.words.forEach((function(a){t.set(a,(t.get(a)||0)+e.amount)}))}));var e,a=this.filters.filter((function(t){return"keyword"===t.category})).map((function(t){return t.name})),n=[],r=Object(N.a)(t.entries());try{for(r.s();!(e=r.n()).done;){var i=Object(W.a)(e.value,2),o=i[0],l=i[1];a.includes(o)||n.push({text:o,value:l})}}catch(s){r.e(s)}finally{r.f()}return n.sort((function(t,e){return e.value-t.value})),n}},{key:"getCategories",value:function(t){var e,a;if(0===this.data.length)return[];a=(null===(e=this.getLastFilter())||void 0===e?void 0:e.category)===t?this.filters.length>=2?this.filters[this.filters.length-2].index:this.data:this.getRecords();var n=new Map;a.forEach((function(e){var a=e[t];n.set(a,(n.get(a)||0)+e.amount)}));var r,i=[],o=Object(N.a)(n.entries());try{for(o.s();!(r=o.n()).done;){var l=Object(W.a)(r.value,2),s=l[0],u=l[1];i.push({text:s,value:u})}}catch(c){o.e(c)}finally{o.f()}return i.sort((function(t,e){return t.value-e.value})),i}},{key:"getAmountBins",value:function(t){if(0===this.data.length)return{data:[],domain:[0,1]};var e,a=null;0!==this.filters.length&&"amount"===this.filters[this.filters.length-1].category?(e=this.filters.length>=2?this.filters[this.filters.length-2].index:this.data,a=this.filters[this.filters.length-1].name.split("~").map((function(t){return I(t)}))):e=this.getRecords();var n=e.reduce((function(t,e){return[Math.min(t[0],e.amount),Math.max(t[1],e.amount)]}),[Number.MAX_VALUE,Number.MIN_VALUE]),r=Object(W.a)(n,2),i=r[0],o=r[1];null===a&&(a=[i,o]);for(var l=[],s=((o+=.001)-i)/t,u=0;u<t;u++)l.push({low:i+u*s,high:i+(u+1)*s,value:0,name:F(i+(u+.5)*s)});return e.forEach((function(t){l.forEach((function(e){e.low<=t.amount&&t.amount<e.high&&(e.value+=t.amount)}))})),{data:l,domain:a}}},{key:"getMonthBins",value:function(){if(0===this.data.length)return{data:[{text:"0000-01",value:0}],domain:["0000-01","0000-01"]};var t,e=null;0!==this.filters.length&&"date"===this.filters[this.filters.length-1].category?(t=this.filters.length>=2?this.filters[this.filters.length-2].index:this.data,e=this.filters[this.filters.length-1].name.split("~")):t=this.getRecords();var a=t.reduce((function(t,e){var a=(e.date.getFullYear()+"").padStart(4,"0")+"-"+(e.date.getMonth()+1+"").padStart(2,"0");return[t[0].localeCompare(a)<0?t[0]:a,t[1].localeCompare(a)>0?t[1]:a]}),["9999-99","0000-00"]),n=Object(W.a)(a,2),r=n[0],i=n[1];null===e&&(e=[r,i]);var o=new Map;t.forEach((function(t){var e=(t.date.getFullYear()+"").padStart(4,"0")+"-"+(t.date.getMonth()+1+"").padStart(2,"0");o.set(e,(o.get(e)||0)+t.amount)}));for(var l=Object(D.a)(o.entries()).map((function(t){return{text:t[0],value:t[1]}})).sort((function(t,e){return t.text.localeCompare(e.text)}));0!==l.length&&l.length<12;){var s=l[l.length-1].text.split("-").map((function(t){return Number.parseInt(t)}));12!==s[1]?s[1]++:s=[s[0]+1,1];var u=(s[0]+"").padStart(4,"0")+"-"+(s[1]+"").padStart(2,"0");l.push({text:u,value:0})}return{data:l,domain:e}}},{key:"getTotal",value:function(){return 0===this.filters.length?this.total_amount:this.filters[this.filters.length-1].amount}},{key:"getDatasetTotal",value:function(){return this.total_amount}},{key:"getFilters",value:function(){return this.filters}},{key:"getLastFilter",value:function(){return 0===this.filters.length?null:this.filters[this.filters.length-1]}},{key:"sliceFilter",value:function(t){this.filters=this.filters.slice(0,t),this.listChangeCallback()}},{key:"addKeywordFilter",value:function(t){if(0!==this.data.length&&!this.filters.reduce((function(e,a){return e||"keyword"===a.category&&a.name===t}),!1)){var e;if(0!==this.filters.length)e=this.filters[this.filters.length-1].index.filter((function(e){return e.words.includes(t)}));else e=this.data.filter((function(e){return e.words.includes(t)}));this.filters.push({category:"keyword",name:t,index:e,amount:e.reduce((function(t,e){return t+e.amount}),0)}),this.listChangeCallback()}}},{key:"addCategoryFilter",value:function(t,e){var a;if(0!==this.data.length&&!this.filters.reduce((function(a,n){return a||n.category===t&&n.name===e}),!1)){var n;if((null===(a=this.getLastFilter())||void 0===a?void 0:a.category)===t&&(this.filters=this.filters.slice(0,-1)),0!==this.filters.length)n=this.filters[this.filters.length-1].index.filter((function(a){return a[t]===e}));else n=this.data.filter((function(a){return a[t]===e}));this.filters.push({category:t,name:e,index:n,amount:n.reduce((function(t,e){return t+e.amount}),0)}),this.listChangeCallback()}}},{key:"addAmountFilter",value:function(t,e){if(0!==this.data.length){this.filters.length>0&&"amount"===this.filters[this.filters.length-1].category&&(this.filters=this.filters.slice(0,-1));var a=(this.filters.length>0?this.filters[this.filters.length-1].index:this.data).filter((function(a){return t<=a.amount&&a.amount<=e}));this.filters.push({category:"amount",name:F(t)+"~"+F(e),index:a,amount:a.reduce((function(t,e){return t+e.amount}),0)}),this.listChangeCallback()}}},{key:"addMonthFilter",value:function(t,e){if(0!==this.data.length){this.filters.length>0&&"date"===this.filters[this.filters.length-1].category&&(this.filters=this.filters.slice(0,-1));var a=(this.filters.length>0?this.filters[this.filters.length-1].index:this.data).filter((function(a){var n=(a.date.getFullYear()+"").padStart(4,"0")+"-"+(a.date.getMonth()+1+"").padStart(2,"0");return t.localeCompare(n)<=0&&n.localeCompare(e)<=0}));this.filters.push({category:"date",name:t+"~"+e,index:a,amount:a.reduce((function(t,e){return t+e.amount}),0)}),this.listChangeCallback()}}}]),t}(),B=function(){function t(){var e=this;Object(l.a)(this,t),this.datasets=[],this.currentDataset=null,this.callbacks=[],this.dataLoader=void 0,this.ready=!1,this.parseDataset(M.getInstance().getQuery()),this.dataLoader=new A(this.currentDataset),M.getInstance().addGenerator(this.getQueryString.bind(this),0),fetch(window.location.pathname+"/datasets.json").then((function(t){return t.json()})).then((function(t){e.datasets=t,e.ready=!0,null===e.currentDataset&&(e.currentDataset=e.datasets[0]),e.dataLoader.setDataset(e.currentDataset),e.callbacks.forEach((function(t){return t()}))}))}return Object(s.a)(t,null,[{key:"getInstance",value:function(){return null===this.instance&&(this.instance=new t),this.instance}}]),Object(s.a)(t,[{key:"addChangeCallback",value:function(t){this.callbacks.push(t)}},{key:"getCurrentDataset",value:function(){if(null!=this.currentDataset)return this.currentDataset}},{key:"getCurrentDatasetName",value:function(){if(null!=this.currentDataset)return t.getDatasetTitle(this.currentDataset)}},{key:"getDatasets",value:function(){if(this.ready)return this.datasets}},{key:"getDatasetNames",value:function(){if(this.ready)return this.datasets.map(t.getDatasetTitle)}},{key:"getDataLoader",value:function(){return this.dataLoader}},{key:"setCurrentDataset",value:function(t){this.currentDataset=t,M.getInstance().update(),this.dataLoader.setDataset(t),this.callbacks.forEach((function(t){return t()}))}},{key:"parseDataset",value:function(t){"?"===t[0]&&(t=t.slice(1));var e=t.split("&").filter((function(t){return t.startsWith("d=")}));0!==e.length&&(this.currentDataset=e[0].substr(2))}},{key:"getQueryString",value:function(){return null===this.currentDataset?"":"d="+this.currentDataset}}],[{key:"getDatasetTitle",value:function(t){return t.match(/^\d*$/)?t+"-"+(Number.parseInt(t)+1).toString():t}}]),t}();B.instance=null;var G=a(556);function R(t){return r.a.createElement(G.a,Object.assign({style:{zIndex:10,color:"#fff"}},t),r.a.createElement("img",{style:{height:"80%"},src:"".concat(window.location.pathname,"/Instruction.png"),alt:"Instructions"}))}var P=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(t){var n;return Object(l.a)(this,a),(n=e.call(this,t)).state={drawer:!1,backdropOn:!1},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;B.getInstance().addChangeCallback((function(){return t.forceUpdate()}))}},{key:"render",value:function(){var t=this,e=function(e){return function(){return t.setState({drawer:e})}},a=function(e){return function(){return t.setState({backdropOn:e})}},n=B.getInstance().getDatasets()||[];return r.a.createElement(d.a,{position:"sticky"},r.a.createElement(h.a,null,r.a.createElement(m.a,{title:"Select Dataset"},r.a.createElement(g.a,{edge:"start",color:"inherit","aria-label":"menu",onClick:e(!0)},r.a.createElement(w.a,null))),r.a.createElement(f.a,{variant:"h6",style:{flexGrow:1}},"Undergraduate Student Association Expenditure "+B.getInstance().getCurrentDatasetName()),r.a.createElement(p.a,{color:"inherit",onClick:a(!0)},r.a.createElement(j.a,null)),r.a.createElement(R,{open:this.state.backdropOn,onClick:a(!1)})),r.a.createElement(v.a,{anchor:"left",open:this.state.drawer,onClose:e(!1)},r.a.createElement("div",{onClick:e(!1)},r.a.createElement(y.a,null,n.map((function(t){return r.a.createElement(b.a,{button:!0,key:t,onClick:function(){e(!1),B.getInstance().setCurrentDataset(t)}},r.a.createElement(k.a,null,r.a.createElement(O.a,null)),r.a.createElement(E.a,{primary:"Budget "+B.getDatasetTitle(t)}))}))))))}}]),a}(r.a.Component),T=a(63),Q=(a(224),a(543)),$=a(260),K=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(t){var n;return Object(l.a)(this,a),(n=e.call(this,t)).callbacks={getWordTooltip:function(t){return"".concat(t.text," has $").concat(F(t.value)," in the category.")},onWordClick:n.getCallback("onWordClick").bind(Object(T.a)(n)),onWordMouseOut:n.getCallback("onWordMouseOut").bind(Object(T.a)(n)),onWordMouseOver:n.getCallback("onWordMouseOver").bind(Object(T.a)(n))},n.options={fontFamily:"impact",fontSizes:[5,60],fontStyle:"normal",fontWeight:"normal",scale:"log",deterministic:!0,rotations:4,rotationAngles:[-45,90],transitionDuration:200},n.state={words:[{text:"Loading...",value:100}]},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){this.props.dataloader.addChangeCallback(this.setWords.bind(this))}},{key:"render",value:function(){return r.a.createElement("div",{style:{height:"80vh"},hidden:this.props.hidden},this.props.hidden?null:r.a.createElement($.a,{callbacks:this.callbacks,words:this.props.dataloader.getWordList().slice(0,80),options:this.options}))}},{key:"getCallback",value:function(t){var e=this;return function(a,n){var r="onWordMouseOut"!==t;Object(Q.a)(n.target).on("click",(function(){r&&e.props.dataloader.addKeywordFilter(a.text)})).transition().attr("background","white").attr("text-decoration",r?"underline":"none")}}},{key:"setWords",value:function(){this.forceUpdate()}}]),a}(n.Component),Y=a(35),_=a(8),U=a(485),J=a(244),V=a(246),q=["January","February","March","April","May","June","July","August","September","October","November","December"],z=function(t){var e=t.value;return r.a.createElement("span",{style:{color:"darkblue"}},e.toLocaleString("en-US",{style:"currency",currency:"USD"}))},H=function(t){var e=t.value;return r.a.createElement("span",null,e.toDateString())},X=function(t){var e=t.column,a=t.row;if("date"===e.name){a.key.toString();var n=a.key.toString().split("-"),i=Object(W.a)(n,2),o=i[0],l=i[1];return r.a.createElement("span",null,q[Number.parseInt(l)-1]," ",o)}return r.a.createElement("span",null,a.value)},Z=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(t){var n;return Object(l.a)(this,a),(n=e.call(this,t)).summaryItems=[{columnName:"date",type:"count"},{columnName:"amount",type:"sum"}],n.columns=[{title:"Row",name:"id"},{title:"Posted Date",name:"date"},{title:"Department",name:"department"},{title:"Fund",name:"fund"},{title:"Division",name:"division"},{title:"Event",name:"event"},{title:"GL",name:"gl"},{title:"Description",name:"description"},{title:"Amount",name:"amount"}],n.tableColumnExtension=[{columnName:"id",wordWrapEnabled:!0},{columnName:"date",wordWrapEnabled:!0},{columnName:"department",wordWrapEnabled:!0},{columnName:"fund",wordWrapEnabled:!0},{columnName:"division",wordWrapEnabled:!0},{columnName:"event",wordWrapEnabled:!0},{columnName:"gl",wordWrapEnabled:!0},{columnName:"description",wordWrapEnabled:!0},{columnName:"amount",wordWrapEnabled:!0,align:"center"}],n.groupSummaryItems=[{columnName:"amount",type:"sum",showInGroupFooter:!1,alignByColumn:!0},{columnName:"amount",type:"sum",showInGroupFooter:!0},{columnName:"date",type:"count",showInGroupFooter:!0}],n.groupingColumnExtensions=[{columnName:"date",criteria:function(t){return t instanceof Date?{key:function(t){return t.getFullYear().toString().padStart(4,"0")+"-"+(t.getMonth()+1).toString().padStart(2,"0")}(t)}:{key:""}}}],n.columnWidth=[{columnName:"id",width:70},{columnName:"date",width:120},{columnName:"fund",width:150},{columnName:"division",width:150},{columnName:"department",width:150},{columnName:"event",width:150},{columnName:"gl",width:150},{columnName:"description",width:350},{columnName:"amount",width:150}],n.exporter=void 0,n.groupWeight=void 0,n.integratedSortingColumnExtensions=[],n.exporter=r.a.createRef(),n.state={sortingState:[{columnName:"id",direction:"asc"}]},n.groupWeight=new Map,void 0!==n.props.groupBy&&"date"!==n.props.groupBy&&n.buildGroupWeightTable(),n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.props.dataloader.addChangeCallback((function(){t.buildGroupWeightTable(),t.forceUpdate()}))}},{key:"buildGroupWeightTable",value:function(){var t=this;void 0!==this.props.groupBy&&"date"!==this.props.groupBy&&(this.groupWeight.clear(),this.groupWeight.set("\nGroupBy".concat(this.props.groupBy),1),this.props.dataloader.getCategories(this.props.groupBy).forEach((function(e){t.groupWeight.set(e.text,e.value)})),this.integratedSortingColumnExtensions=[{columnName:this.props.groupBy,compare:function(e,a){var n,r;return((null===(n=t.groupWeight)||void 0===n?void 0:n.get(e))||0)-((null===(r=t.groupWeight)||void 0===r?void 0:r.get(a))||0)}}])}},{key:"render",value:function(){var t=this,e=this.props.dataloader.getRecords().map((function(t,e){return t.id=e,t}));return void 0===this.props.groupBy||"date"===this.props.groupBy||this.groupWeight.has("\nGroupBy".concat(this.props.groupBy))||(this.buildGroupWeightTable(),console.log("built table")),r.a.createElement(U.a,null,r.a.createElement(Y.b,{rows:e,columns:this.columns},r.a.createElement(_.r,{sorting:this.state.sortingState,onSortingChange:this.setSorting.bind(this)}),r.a.createElement(_.h,{grouping:void 0!==this.props.groupBy?[{columnName:this.props.groupBy}]:[]}),r.a.createElement(_.p,null),r.a.createElement(_.t,{totalItems:this.summaryItems,groupItems:this.groupSummaryItems}),r.a.createElement(_.k,{columnExtensions:this.groupingColumnExtensions}),r.a.createElement(_.j,null),r.a.createElement(_.l,{columnExtensions:this.integratedSortingColumnExtensions}),r.a.createElement(_.m,null),r.a.createElement(_.b,{for:["amount"],formatterComponent:z}),r.a.createElement(_.b,{for:["date"],formatterComponent:H}),r.a.createElement(Y.k,{columnExtensions:this.tableColumnExtension}),r.a.createElement(Y.e,{defaultColumnWidths:this.columnWidth}),r.a.createElement(Y.f,{defaultHiddenColumnNames:["id"]}),r.a.createElement(Y.h,{showSortingControls:!0}),"date"===this.props.groupBy?r.a.createElement(Y.g,{contentComponent:X,columnExtensions:[{columnName:"date",showWhenGrouped:!0}]}):r.a.createElement(Y.g,null),r.a.createElement(Y.i,null),r.a.createElement(Y.j,null),r.a.createElement(Y.c,{showSortingControls:!0,emptyMessageComponent:function(){return r.a.createElement("span",null)}}),r.a.createElement(Y.d,null),r.a.createElement(Y.a,{startExport:function(e){var a;return null===(a=t.exporter.current)||void 0===a?void 0:a.exportGrid(e)}})),r.a.createElement(J.a,{ref:this.exporter,columns:this.columns,rows:e,onSave:function(e){return t.onSave(e)}}))}},{key:"setSorting",value:function(t){var e=[],a=this.state.sortingState;t.forEach((function(t){var n,r=!0,i=Object(N.a)(a);try{for(i.s();!(n=i.n()).done;){var o=n.value;if(t.columnName===o.columnName&&"asc"===t.direction&&"desc"===o.direction){r=!1;break}}}catch(l){i.e(l)}finally{i.f()}r&&e.push(t)})),this.setState({sortingState:e})}},{key:"onSave",value:function(t){t.xlsx.writeBuffer().then((function(t){Object(V.saveAs)(new Blob([t],{type:"application/octet-stream"}),"Transactions-".concat(B.getInstance().getCurrentDatasetName(),".xlsx"))}))}}]),a}(n.Component),tt=a(555),et=a(548),at=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(){return Object(l.a)(this,a),e.apply(this,arguments)}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.props.dataloader.addChangeCallback((function(){return t.forceUpdate()}))}},{key:"render",value:function(){var t=this,e=this.props.dataloader.getFilters();return r.a.createElement(tt.a,{separator:">",style:this.props.style},r.a.createElement(m.a,{title:"Remove All Filters"},r.a.createElement(et.a,{key:-1,color:"textPrimary",onClick:function(){return t.props.dataloader.sliceFilter(0)}},"Transactions [$",F(this.props.dataloader.getDatasetTotal()),"]")),e.slice(0,-1).map((function(e,a){return r.a.createElement(m.a,{title:"View This Filter"},r.a.createElement(et.a,{key:a,color:"textSecondary",onClick:function(){return t.props.dataloader.sliceFilter(a+1)}},e.category,": ",e.name," [$",F(e.amount),"]"))})),e.length>0?r.a.createElement(f.a,{color:"textPrimary",key:e.length},e[e.length-1].category,": ",e[e.length-1].name," [$",F(e[e.length-1].amount),"]"):null)}}]),a}(n.Component),nt=a(22),rt=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(){return Object(l.a)(this,a),e.apply(this,arguments)}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.props.dataloader.addChangeCallback((function(){return t.forceUpdate()}))}},{key:"render",value:function(){var t=this,e=this.props.dataloader.getCategories(this.props.category),a=this.props.dataloader.getLastFilter(),n=null==a?void 0:a.category===this.props.category?a.name:void 0;return r.a.createElement("div",{style:{height:"80vh"},hidden:this.props.hidden||!1},this.props.hidden?null:r.a.createElement(nt.k,{height:"100%",width:"100%"},r.a.createElement(nt.i,null,r.a.createElement(nt.h,{data:e,dataKey:"value",nameKey:"text",label:function(t){var e=t.percent,a=t.name;return(e||0)>.005?a:""},labelLine:!1,onClick:function(e){return t.props.dataloader.addCategoryFilter(t.props.category,e.text)}},e.map((function(e,a){return r.a.createElement(nt.f,{key:"cell-".concat(a),fill:t.getColor(n===e.text)})}))),r.a.createElement(nt.l,{formatter:function(t){return"$"+F(t)},contentStyle:{padding:"0 5px",margin:0,borderRadius:5}}))))}},{key:"getColor",value:function(t){if(t)return"#f44336";switch(this.props.category){case"fund":return"#8bc34a";case"division":return"#ab47bc";case"department":return"#26c6da";case"gl":return"#26a69a";case"event":return"#ef6c00"}}}]),a}(n.Component),it=a(551),ot=a(549),lt=a(559),st=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(t){var n;return Object(l.a)(this,a),(n=e.call(this,t)).state={value:[0,100],data:[]},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.props.dataloader.addChangeCallback((function(){return t.updateState()})),this.updateState()}},{key:"updateState",value:function(){var t=this.props.dataloader.getAmountBins(20),e=t.data,a=t.domain;this.setState({data:e,value:a})}},{key:"render",value:function(){var t=this,e=this.state.data,n=0===e.length?[0,1]:[e[0].low,e[e.length-1].high];return r.a.createElement("div",{style:{paddingLeft:"5%",paddingRight:"calc(5% + ".concat(a.getYAxisWidth(),"px)"),height:"80vh",margin:"auto"},hidden:this.props.hidden||!1},this.props.hidden?null:r.a.createElement(nt.k,{height:"90%",width:"100%"},r.a.createElement(nt.d,{data:e,barCategoryGap:0,margin:{bottom:0,left:0,right:0}},r.a.createElement(nt.e,{strokeDasharray:"3 3"}),r.a.createElement(nt.m,{dataKey:"name",domain:n,hide:!0,orientation:"top"}),r.a.createElement(nt.n,{domain:[0,"dataMax"],tickFormatter:function(t){return"$"+F(t)},width:a.getYAxisWidth()},r.a.createElement(nt.g,{angle:270,position:"insideLeft",style:{textAnchor:"middle"}},"Expense Sum in Transaction Amount Bin($)")),r.a.createElement(nt.j,{y:0,label:"",stroke:"black"}),r.a.createElement(nt.c,{dataKey:"value",fill:this.getColor()},e.map((function(e,a){return r.a.createElement(nt.f,{key:"cell-".concat(a),fill:t.getColor(),opacity:t.getOpacity(e.low,e.high)})}))))),r.a.createElement("div",{style:{paddingLeft:a.getYAxisWidth()}},r.a.createElement(lt.a,{value:this.state.value,min:n[0],max:n[1],onChange:this.onRangeChange.bind(this),onChangeCommitted:this.onRangeChangeCommitted.bind(this),valueLabelDisplay:"auto",valueLabelFormat:function(t){return"$"+F(t)},marks:this.getMarks(n)})))}},{key:"onRangeChange",value:function(t,e){this.setState({value:e})}},{key:"onRangeChangeCommitted",value:function(t,e){var a=e;this.props.dataloader.addAmountFilter(a[0],a[1])}},{key:"getColor",value:function(){return"#29b6f6"}},{key:"getOpacity",value:function(t,e){return.3+.7*(Math.max(0,Math.min(this.state.value[1],e)-Math.max(this.state.value[0],t))/(e-t))}},{key:"getMarkPoint",value:function(t){return{value:t,label:"$"+F(t)}}},{key:"getMarks",value:function(t){var e=this,n=60/(.8*a.getViewportWidth()-a.getYAxisWidth())*(t[1]-t[0]),r=t.map((function(t){return e.getMarkPoint(t)}));t[0]<0&&t[1]>0&&(r=r.filter((function(t){return Math.abs(t.value)>=n}))).push(this.getMarkPoint(0));for(var i=Math.max((t[1]-t[0])/10,n),o=1;t[0]+o*i<=t[1]-n;o++){var l=Number.parseFloat((t[0]+o*i).toPrecision(2));Math.abs(l)<.9*i||r.push(this.getMarkPoint(l))}return r}}],[{key:"getViewportWidth",value:function(){return Math.max(document.documentElement.clientWidth,window.innerWidth||0)}},{key:"getYAxisWidth",value:function(){return a.getViewportWidth()<480?0:72}}]),a}(n.Component),ut=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],ct=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(t){var n;return Object(l.a)(this,a),(n=e.call(this,t)).state={value:[0,1],domain:["0000-01","9999-12"],data:[]},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.props.dataloader.addChangeCallback((function(){return t.updateState()})),this.updateState()}},{key:"updateState",value:function(){var t=this.props.dataloader.getMonthBins(),e=t.data,a=t.domain,n=e.map((function(t){return t.text}));this.setState({data:e,value:[n.indexOf(a[0])+.5,n.indexOf(a[1])+.5]})}},{key:"render",value:function(){var t=this.state.data;return r.a.createElement("div",{style:{paddingLeft:"5%",paddingRight:"calc(5% + ".concat(a.getYAxisWidth(),"px)"),height:"80vh",margin:"auto"},hidden:this.props.hidden||!1},this.props.hidden?null:r.a.createElement(nt.k,{height:"90%",width:"100%"},r.a.createElement(nt.b,{data:t,barCategoryGap:0,margin:{bottom:0,left:0,right:0}},r.a.createElement("defs",null,r.a.createElement("linearGradient",{id:"fillGrad",x1:"0",y1:"0",x2:"0",y2:"1"},r.a.createElement("stop",{offset:"5%",stopColor:this.getColor(),stopOpacity:.9}),r.a.createElement("stop",{offset:"95%",stopColor:this.getColor(),stopOpacity:.3})),r.a.createElement("linearGradient",{id:"fillGrad2",x1:"0",y1:"0",x2:"1",y2:"0"},r.a.createElement("stop",{offset:this.getLeftPoint()-.01,stopColor:this.getColor(),stopOpacity:.2}),r.a.createElement("stop",{offset:this.getLeftPoint()+.01,stopColor:this.getColor(),stopOpacity:.6}),r.a.createElement("stop",{offset:this.getRightPoint()-.01,stopColor:this.getColor(),stopOpacity:.6}),r.a.createElement("stop",{offset:this.getRightPoint()+.01,stopColor:this.getColor(),stopOpacity:.2}))),r.a.createElement(nt.e,{strokeDasharray:"3 3"}),r.a.createElement(nt.m,{dataKey:"text",hide:!0,orientation:"top",scale:"band"}),r.a.createElement(nt.n,{tickFormatter:function(t){return"$"+F(t)},width:a.getYAxisWidth()},r.a.createElement(nt.g,{angle:270,position:"insideLeft",style:{textAnchor:"middle"}},"Monthly Expense($)")),r.a.createElement(nt.l,{formatter:function(t){return"$"+F(t)},contentStyle:{display:"none"}}),r.a.createElement(nt.j,{y:0,label:"",stroke:"black"}),r.a.createElement(nt.a,{type:"monotone",dataKey:"value",stroke:this.getColor(),fillOpacity:1,fill:"url(#fillGrad2)"}))),r.a.createElement("div",{style:{paddingLeft:a.getYAxisWidth()}},r.a.createElement(lt.a,{value:this.state.value,min:0,max:this.state.data.length,onChange:this.onRangeChange.bind(this),onChangeCommitted:this.onRangeChangeCommitted.bind(this),valueLabelDisplay:"off",marks:this.getMarks(this.state.data),step:null})))}},{key:"onRangeChange",value:function(t,e){this.setState({value:e})}},{key:"onRangeChangeCommitted",value:function(t,e){var a=e.map((function(t){return Math.round(t-.5)})),n=this.state.data;this.props.dataloader.addMonthFilter(n[a[0]].text,n[a[1]].text)}},{key:"getColor",value:function(){return"#009688"}},{key:"getOpacity",value:function(t){return t+=.5,this.state.value[0]<=t&&t<=this.state.value[1]?1:.3}},{key:"getLeftPoint",value:function(){return(this.state.value[0]-1)/(this.state.data.length-1)}},{key:"getRightPoint",value:function(){return this.state.value[1]/(this.state.data.length-1)}},{key:"getMarks",value:function(t){var e=t.map((function(t,e){return{value:e+.5,label:t.text}})),a=new Set;return e.forEach((function(t,n){var r=t.label.split("-");a.has(r[0])?e[n].label=ut[Number.parseInt(r[1])-1]:(a.add(r[0]),e[n].label=ut[Number.parseInt(r[1])-1]+" ".concat(r[0]))})),e}}],[{key:"getViewportWidth",value:function(){return Math.max(document.documentElement.clientWidth,window.innerWidth||0)}},{key:"getYAxisWidth",value:function(){return this.getViewportWidth()<480?0:72}}]),a}(n.Component),dt=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(t){var n;return Object(l.a)(this,a),(n=e.call(this,t)).value=0,n.value=n.parseQuery(M.getInstance().getQuery()),n.state={value:n.value},M.getInstance().addGenerator(n.generateQuery.bind(Object(T.a)(n)),1),n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.props.loader.addChangeCallback((function(){return t.forceUpdate()}))}},{key:"parseQuery",value:function(t){"?"===t[0]&&(t=t.slice(1));var e=t.split("&").filter((function(t){return t.startsWith("tab=")}));return 0===e.length?0:Number.parseInt(e[0].substr(4))}},{key:"generateQuery",value:function(){return"tab="+this.value}},{key:"render",value:function(){var t=this,e=this.props.loader;return r.a.createElement(U.a,{variant:"outlined",style:{margin:"0 10%"}},r.a.createElement(at,{style:{margin:10},dataloader:e}),r.a.createElement(it.a,{value:this.state.value,onChange:function(e,a){t.value=a,t.setState({value:a}),M.getInstance().update()},variant:"scrollable",indicatorColor:"primary",textColor:"primary"},r.a.createElement(ot.a,{label:"Keywords"}),r.a.createElement(ot.a,{label:"Fund"}),r.a.createElement(ot.a,{label:"Division"}),r.a.createElement(ot.a,{label:"Department"}),r.a.createElement(ot.a,{label:"GL"}),r.a.createElement(ot.a,{label:"Event"}),r.a.createElement(ot.a,{label:"Amount"}),r.a.createElement(ot.a,{label:"Date"})),r.a.createElement(K,{hidden:0!==this.state.value,dataloader:e}),r.a.createElement(rt,{hidden:1!==this.state.value,category:"fund",dataloader:e}),r.a.createElement(rt,{hidden:2!==this.state.value,category:"division",dataloader:e}),r.a.createElement(rt,{hidden:3!==this.state.value,category:"department",dataloader:e}),r.a.createElement(rt,{hidden:4!==this.state.value,category:"gl",dataloader:e}),r.a.createElement(rt,{hidden:5!==this.state.value,category:"event",dataloader:e}),r.a.createElement(st,{hidden:6!==this.state.value,dataloader:e}),r.a.createElement(ct,{hidden:7!==this.state.value,dataloader:e}),r.a.createElement(Z,{dataloader:e,groupBy:this.getCategory(this.state.value)}))}},{key:"getCategory",value:function(t){switch(t){case 1:return"fund";case 2:return"division";case 3:return"department";case 4:return"gl";case 5:return"event";case 7:return"date";default:return}}}]),a}(r.a.Component),ht=a(259),mt=a.n(ht),gt=a(165),ft=a.n(gt);function pt(){return r.a.createElement("footer",null,r.a.createElement(U.a,{variant:"outlined",style:{margin:"0 10%",padding:20}},r.a.createElement(et.a,{color:"textSecondary",href:"https://forms.google.com",style:{padding:20}},r.a.createElement(mt.a,null)," Comments"),r.a.createElement(et.a,{color:"textSecondary",href:"mailto:vtran@asucla.ucla.edu",style:{padding:20}},r.a.createElement(ft.a,null)," Professional Accountant"),r.a.createElement(et.a,{color:"textSecondary",href:"mailto:usacouncil@asucla.ucla.edu",style:{padding:20}},r.a.createElement(ft.a,null)," USAC Council")))}var vt=function(t){Object(u.a)(a,t);var e=Object(c.a)(a);function a(t){var n;return Object(l.a)(this,a),(n=e.call(this,t)).state={loader:B.getInstance().getDataLoader()},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var t=this;B.getInstance().addChangeCallback((function(){t.setState({loader:B.getInstance().getDataLoader()})}))}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(P,null),r.a.createElement(dt,{loader:this.state.loader}),r.a.createElement(pt,null))}}]),a}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(vt,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[289,1,2]]]);
//# sourceMappingURL=main.18ebaca3.chunk.js.map