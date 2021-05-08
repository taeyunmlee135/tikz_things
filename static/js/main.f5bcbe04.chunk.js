(this.webpackJsonptikz_things=this.webpackJsonptikz_things||[]).push([[0],{63:function(t,e,n){},64:function(t,e,n){},65:function(t,e,n){},68:function(t,e,n){"use strict";n.r(e);var c=n(2),a=n.n(c),r=n(25),i=n.n(r),s=(n(63),n(11)),o=n(12),d=n(13),l=n(14),u=(n(64),n(65),n(0)),h=function(t){var e=t.onSwitchOn,n=t.onSwitchOff,c=t.defaultVal,a=void 0!==c&&c;return Object(u.jsxs)("label",{className:"switch",children:[Object(u.jsx)("input",{type:"checkbox",defaultChecked:a,onChange:function(t){return function(t){t.target.checked?e():n()}(t)}}),Object(u.jsx)("span",{className:"slider round"})]})},p=function(t){var e=t.coordinates;return Object(u.jsxs)("div",{className:"codefont",id:"code-output",children:["\\usetikzlibrary{hobby} %excellent drawing algorithm"," ",Object(u.jsx)("br",{}),"\\begin{tikzpicture}"," ",Object(u.jsx)("br",{}),e,"\\end{tikzpicture}"]})},f=n(7),j=n(1),x=function(t){Object(d.a)(n,t);var e=Object(l.a)(n);function n(){var t;Object(s.a)(this,n);for(var c=arguments.length,a=new Array(c),r=0;r<c;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))).state={currCodeStatement:{statementType:"",preamble:"",point:"",end:""},points:[],currFigure:0,figures:{fig_0:[]}},t.componentDidUpdate=function(e){e.theme!==t.props.theme&&(j.e("#x-axis").attr("class","".concat(t.props.theme,"-axis")),j.e("#y-axis").attr("class","".concat(t.props.theme,"-axis")))},t.handleMouseOver=function(e,n){j.e(e.target).attr("r",6),j.e("svg").append("text").attr("id","t".concat(n.x,"-").concat(n.y,"-").concat(j.e("svg").nodes().indexOf(Object(f.a)(t)))).attr("x",(function(){return t.xScale(n.x)-30})).attr("y",(function(){return t.yScale(n.y)-15})).attr("class","".concat(t.props.theme)).text((function(){return[n.x,n.y]}))},t.handleMouseOut=function(e,n){j.e(e.target).attr("r",3),j.e("#t".concat(n.x,"-").concat(n.y,"-").concat(j.e("svg").nodes().indexOf(Object(f.a)(t)))).remove()},t.handleSvgClick=function(e,n,c){if(console.log("click"),""!==t.state.currCodeStatement.preamble){var a=j.c(e),r={x:Math.round(t.xScale.invert(a[0])),y:Math.round(t.yScale.invert(a[1]))};t.state.currCodeStatement.point="(".concat(r.x/10,", ").concat(r.y/10,") "),t.state.points.push(r),t.state.figures["fig_".concat(t.state.currFigure)].push(r),t.props.updateCodeStatement(),n.selectAll("circle").data(t.state.points).enter().append("circle").attr("cx",c.cx).attr("cy",c.cy).attr("r",c.r).attr("fill",c.fill).attr("id","c-fig_".concat(t.state.currFigure,"-").concat(t.state.figures["fig_".concat(t.state.currFigure)].length-1)).on("mouseover",t.handleMouseOver).on("mouseout",t.handleMouseOut)}},t}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var t=this,e=document.getElementById("plotWrapper").getBoundingClientRect(),n=Math.min(e.right,e.bottom)-150;this.xScale=j.d().domain([0,100]).range([0,n-30-10]),this.yScale=j.d().domain([0,100]).range([n-10-30,0]);var c=j.a().scale(this.xScale),a=j.b().scale(this.yScale),r={cx:function(e){return t.xScale(e.x)},cy:function(e){return t.yScale(e.y)},r:3,fill:"rgb(50, 149, 237)"},i=j.e("#canvas").append("svg").attr("width",n).attr("height",n);i.append("g").attr("class","".concat(this.props.theme,"-axis")).attr("transform","translate(".concat([30,n-30],")")).attr("id","x-axis").call(c),i.append("g").attr("class","".concat(this.props.theme,"-axis")).attr("transform","translate(".concat([30,10],")")).attr("id","y-axis").call(a),i.on("click",(function(e){return t.handleSvgClick(e,i,r)}))}},{key:"render",value:function(){return Object(u.jsx)("div",{style:{flex:"1",padding:"30px"},id:"plotWrapper",children:Object(u.jsx)("div",{id:"canvas"})})}}]),n}(c.Component),b=function(t){Object(d.a)(n,t);var e=Object(l.a)(n);function n(){var t;Object(s.a)(this,n);for(var c=arguments.length,a=new Array(c),r=0;r<c;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))).state={theme:"light",coordinates:[]},t}return Object(o.a)(n,[{key:"render",value:function(){var t=this;return console.log(this.state),Object(u.jsxs)("div",{className:"App ".concat(this.state.theme),children:[Object(u.jsx)("div",{id:"text-heading",children:Object(u.jsxs)("div",{id:"description",children:["Simple Canvas For Control Points",Object(u.jsxs)("p",{id:"sub_description",children:['Before you can draw, you need to select a code statement. Select "add ',Object(u.jsx)("span",{className:"codefont",children:"\\draw"}),'" to create a TikZ ',Object(u.jsx)("span",{className:"codefont",children:"\\draw"}),' statement. "add ',Object(u.jsx)("span",{className:"codefont",children:"\\node"}),'" works similarly.']})]})}),Object(u.jsxs)("div",{id:"main-body-parent",children:[Object(u.jsx)(x,{updateCodeStatement:function(){},theme:this.state.theme}),Object(u.jsxs)("div",{className:"button-and-code",children:[Object(u.jsx)("div",{style:{width:"100%"},children:Object(u.jsxs)("div",{id:"theme-selection",children:[Object(u.jsx)(h,{onSwitchOn:function(){t.setState({theme:"dark"})},onSwitchOff:function(){t.setState({theme:"light"})}}),Object(u.jsx)("p",{children:" Dark Mode "})]})}),Object(u.jsx)(p,{coordinates:this.state.coordinates})]})]})]})}}]),n}(c.Component),m=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,69)).then((function(e){var n=e.getCLS,c=e.getFID,a=e.getFCP,r=e.getLCP,i=e.getTTFB;n(t),c(t),a(t),r(t),i(t)}))};i.a.render(Object(u.jsx)(a.a.StrictMode,{children:Object(u.jsx)(b,{})}),document.getElementById("root")),m()}},[[68,1,2]]]);
//# sourceMappingURL=main.f5bcbe04.chunk.js.map