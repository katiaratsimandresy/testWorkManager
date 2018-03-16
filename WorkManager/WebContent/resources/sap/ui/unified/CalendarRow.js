/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/model/type/Date','sap/ui/unified/calendar/CalendarUtils','sap/ui/core/date/UniversalDate','./library'],function(q,C,L,D,a,U,l){"use strict";var b=C.extend("sap.ui.unified.CalendarRow",{metadata:{library:"sap.ui.unified",properties:{startDate:{type:"object",group:"Data"},intervals:{type:"int",group:"Appearance",defaultValue:12},intervalType:{type:"sap.ui.unified.CalendarIntervalType",group:"Appearance",defaultValue:sap.ui.unified.CalendarIntervalType.Hour},showSubIntervals:{type:"boolean",group:"Appearance",defaultValue:false},showIntervalHeaders:{type:"boolean",group:"Appearance",defaultValue:true},showEmptyIntervalHeaders:{type:"boolean",group:"Appearance",defaultValue:true},nonWorkingDays:{type:"int[]",group:"Misc",defaultValue:null},nonWorkingHours:{type:"int[]",group:"Misc",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},checkResize:{type:"boolean",group:"Behavior",defaultValue:true},updateCurrentTime:{type:"boolean",group:"Behavior",defaultValue:true},appointmentsReducedHeight:{type:"boolean",group:"Appearance",defaultValue:false},appointmentsVisualization:{type:"sap.ui.unified.CalendarAppointmentVisualization",group:"Appearance",defaultValue:sap.ui.unified.CalendarAppointmentVisualization.Standard}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment"},intervalHeaders:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"intervalHeader"},groupAppointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"groupAppointment",visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"},multiSelect:{type:"boolean"}}},startDateChange:{},leaveRow:{parameters:{type:{type:"string"}}},intervalSelect:{parameters:{startDate:{type:"object"},endDate:{type:"object"},subInterval:{type:"boolean"}}}}}});b.prototype.init=function(){this._bRTL=sap.ui.getCore().getConfiguration().getRTL();this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");if(!sap.ui.unified.CalendarRow._oStaticAppointmentText){sap.ui.unified.CalendarRow._oStaticAppointmentText=new sap.ui.core.InvisibleText({text:this._oRb.getText("APPOINTMENT")});sap.ui.unified.CalendarRow._oStaticAppointmentText.toStatic();sap.ui.unified.CalendarRow._oStaticTentativeText=new sap.ui.core.InvisibleText({text:this._oRb.getText("APPOINTMENT_TENTATIVE")});sap.ui.unified.CalendarRow._oStaticTentativeText.toStatic();}this._oFormatAria=sap.ui.core.format.DateFormat.getDateTimeInstance({style:"long/short"});this._iHoursMinDelta=1;this._iDaysMinDelta=30;this._iMonthsMinDelta=720;this._aVisibleAppointments=[];this._aVisibleIntervalHeaders=[];this.setStartDate(new Date());this._resizeProxy=q.proxy(this.handleResize,this);};b.prototype.exit=function(){if(this._sResizeListener){sap.ui.core.ResizeHandler.deregister(this._sResizeListener);this._sResizeListener=undefined;}if(this._sUpdateCurrentTime){q.sap.clearDelayedCall(this._sUpdateCurrentTime);this._sUpdateCurrentTime=undefined;}};b.prototype.onBeforeRendering=function(){d.call(this);f.call(this);n.call(this);if(this._sUpdateCurrentTime){q.sap.clearDelayedCall(this._sUpdateCurrentTime);this._sUpdateCurrentTime=undefined;}};b.prototype.onAfterRendering=function(){o.call(this);this.updateCurrentTimeVisualization();if(this.getCheckResize()&&!this._sResizeListener){this._sResizeListener=sap.ui.core.ResizeHandler.register(this,this._resizeProxy);}};b.prototype.onThemeChanged=function(E){if(this.getDomRef()){for(var i=0;i<this._aVisibleAppointments.length;i++){var A=this._aVisibleAppointments[i];A.level=-1;}this.handleResize(E);}};b.prototype.invalidate=function(O){if(O&&O instanceof sap.ui.unified.CalendarAppointment){var F=false;for(var i=0;i<this._aVisibleAppointments.length;i++){if(this._aVisibleAppointments[i].appointment==O){F=true;break;}}if(F){this._aVisibleAppointments=[];}}C.prototype.invalidate.apply(this,arguments);};b.prototype.setStartDate=function(S){if(!S){S=new Date();}if(!(S instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}var y=S.getFullYear();if(y<1||y>9999){throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); "+this);}this.setProperty("startDate",S);return this;};b.prototype._getStartDate=function(){if(!this._oUTCStartDate){this._oUTCStartDate=a._createUniversalUTCDate(this.getStartDate(),undefined,true);}return this._oUTCStartDate;};b.prototype.setIntervalType=function(i){this.setProperty("intervalType",i);this._aVisibleAppointments=[];return this;};b.prototype.setAppointmentsReducedHeight=function(A){this.setProperty("appointmentsReducedHeight",A);this._aVisibleAppointments=[];return this;};b.prototype._getAppointmentReducedHeight=function(A){var R=false;if(!sap.ui.Device.system.phone&&this.getAppointmentsReducedHeight()&&!A.getText()){R=true;}return R;};b.prototype.onfocusin=function(E){if(q(E.target).hasClass("sapUiCalendarApp")){t.call(this,E.target.id);}else{var V=this._getVisibleAppointments();var F=false;var A;for(var i=0;i<V.length;i++){A=V[i].appointment;if(q.sap.containsOrEquals(A.getDomRef(),E.target)){F=true;A.focus();break;}}if(!F){A=this.getFocusedAppointment();if(A){A.focus();}}}};b.prototype.applyFocusInfo=function(F){if(this._sFocusedAppointmentId){this.getFocusedAppointment().focus();}return this;};b.prototype.onsapleft=function(E){if(q(E.target).hasClass("sapUiCalendarApp")){u.call(this,this._bRTL,1);}E.preventDefault();E.stopPropagation();};b.prototype.onsapright=function(E){if(q(E.target).hasClass("sapUiCalendarApp")){u.call(this,!this._bRTL,1);}E.preventDefault();E.stopPropagation();};b.prototype.onsapup=function(E){this.fireLeaveRow({type:E.type});};b.prototype.onsapdown=function(E){this.fireLeaveRow({type:E.type});};b.prototype.onsaphome=function(E){v.call(this,E);E.preventDefault();E.stopPropagation();};b.prototype.onsapend=function(E){v.call(this,E);E.preventDefault();E.stopPropagation();};b.prototype.onsapselect=function(E){var V=this._getVisibleAppointments();for(var i=0;i<V.length;i++){var A=V[i].appointment;if(q.sap.containsOrEquals(A.getDomRef(),E.target)){p.call(this,A,!E.ctrlKey);break;}}E.stopPropagation();E.preventDefault();};b.prototype.ontap=function(E){var i=this.$("Apps").children(".sapUiCalendarRowAppsInt");var I=0;var j=false;for(I=0;I<i.length;I++){var k=i[I];if(q.sap.containsOrEquals(k,E.target)){j=true;break;}}if(j){w.call(this,I,E.target);}else{this.onsapselect(E);}};b.prototype.onsapselectmodifiers=function(E){this.onsapselect(E);};b.prototype.handleResize=function(E){if(E&&E.size&&E.size.width<=0){return this;}var $=this.$("DummyApp");$.css("display","");o.call(this);return this;};b.prototype.updateCurrentTimeVisualization=function(){var N=this.$("Now");var i=a._createUniversalUTCDate(new Date(),undefined,true);var I=this.getIntervals();var j=this.getIntervalType();var S=this._getStartDate();var k=S.getTime();var E=this._oUTCEndDate;var x=E.getTime();this._sUpdateCurrentTime=undefined;if(i.getTime()<=x&&i.getTime()>=k){var B=h.call(this,j,I,S,E,k,i);var T=0;if(this._bRTL){N.css("right",B+"%");}else{N.css("left",B+"%");}N.css("display","");if(this.getUpdateCurrentTime()){switch(j){case sap.ui.unified.CalendarIntervalType.Hour:T=60000;break;case sap.ui.unified.CalendarIntervalType.Day:T=1800000;break;default:T=-1;break;}if(T>0){this._sUpdateCurrentTime=q.sap.delayedCall(T,this,this.updateCurrentTimeVisualization);}}}else{N.css("display","none");}return this;};b.prototype.getFocusedAppointment=function(){var A=r.call(this);var G=this.getAggregation("groupAppointments",[]);var j;var i=0;for(i=0;i<G.length;i++){if(G[i].getId()==this._sFocusedAppointmentId){j=G[i];break;}}if(!j){for(i=0;i<A.length;i++){if(A[i].getId()==this._sFocusedAppointmentId){j=A[i];break;}}}return j;};b.prototype.focusAppointment=function(A){if(!A||!(A instanceof sap.ui.unified.CalendarAppointment)){throw new Error("Appointment must be a CalendarAppointment; "+this);}var i=A.getId();if(this._sFocusedAppointmentId!=i){t.call(this,i);}else{A.focus();}return this;};b.prototype.focusNearestAppointment=function(j){if(!j||!(j instanceof Date)){throw new Error("Date must be a JavaScript date object; "+this);}var A=r.call(this);var N;var P;var k;for(var i=0;i<A.length;i++){N=A[i];if(N.getStartDate()>j){if(i>0){P=A[i-1];}else{P=N;}break;}}if(N){if(P&&Math.abs(N.getStartDate()-j)>=Math.abs(P.getStartDate()-j)){k=P;}else{k=N;}this.focusAppointment(k);}return this;};b.prototype._getVisibleAppointments=function(){return this._aVisibleAppointments;};b.prototype._getVisibleIntervalHeaders=function(){return this._aVisibleIntervalHeaders;};b.prototype._getNonWorkingDays=function(){var N=this.getNonWorkingDays();if(!N){var j=c.call(this);var W=j.getWeekendStart();var k=j.getWeekendEnd();N=[];for(var i=0;i<=6;i++){if((W<=k&&i>=W&&i<=k)||(W>k&&(i>=W||i<=k))){N.push(i);}}}else if(!q.isArray(N)){N=[];}return N;};function _(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;}function c(){if(!this._oLocaleData){var i=_.call(this);var j=new sap.ui.core.Locale(i);this._oLocaleData=L.getInstance(j);}return this._oLocaleData;}function d(){var S=this.getStartDate();var E;var i=this.getIntervals();var I=this.getIntervalType();this._oUTCStartDate=e.call(this,S);switch(I){case sap.ui.unified.CalendarIntervalType.Hour:E=new U(this._oUTCStartDate.getTime());E.setUTCHours(E.getUTCHours()+i);this._iMinDelta=this._iHoursMinDelta;break;case sap.ui.unified.CalendarIntervalType.Day:E=new U(this._oUTCStartDate.getTime());E.setUTCDate(E.getUTCDate()+i);this._iMinDelta=this._iDaysMinDelta;break;case sap.ui.unified.CalendarIntervalType.Month:E=new U(this._oUTCStartDate.getTime());E.setUTCMonth(E.getUTCMonth()+i);this._iMinDelta=this._iMonthsMinDelta;break;default:throw new Error("Unknown IntervalType: "+I+"; "+this);}E.setUTCMilliseconds(-1);this._iRowSize=E.getTime()-this._oUTCStartDate.getTime();this._iIntervalSize=Math.floor(this._iRowSize/i);this._oUTCEndDate=E;}function e(i){var I=this.getIntervalType();var j=a._createUniversalUTCDate(i,undefined,true);switch(I){case sap.ui.unified.CalendarIntervalType.Hour:j.setUTCMinutes(0);j.setUTCSeconds(0);j.setUTCMilliseconds(0);break;case sap.ui.unified.CalendarIntervalType.Day:j.setUTCHours(0);j.setUTCMinutes(0);j.setUTCSeconds(0);j.setUTCMilliseconds(0);break;case sap.ui.unified.CalendarIntervalType.Month:j.setUTCDate(1);j.setUTCHours(0);j.setUTCMinutes(0);j.setUTCSeconds(0);j.setUTCMilliseconds(0);break;default:throw new Error("Unknown IntervalType: "+I+"; "+this);}return j;}function f(){var O=this._aVisibleAppointments||[];var A=r.call(this);var x;var G;var y;var I=this.getIntervals();var z=this.getIntervalType();var S=this._getStartDate();var B=S.getTime();var E=this._oUTCEndDate;var F=E.getTime();var V=[];var H=false;var i=0;var j=0;this.destroyAggregation("groupAppointments",true);for(i=0;i<A.length;i++){x=A[i];var J=a._createUniversalUTCDate(x.getStartDate(),undefined,true);J.setUTCSeconds(0);J.setUTCMilliseconds(0);var K=a._createUniversalUTCDate(x.getEndDate(),undefined,true);K.setUTCSeconds(0);K.setUTCMilliseconds(0);var M=false;if(J.getTime()<B&&K.getTime()>=B){J=new U(B);M=true;}if(K.getTime()>F&&J.getTime()<=F){K=new U(F);M=true;}var N=J.getUTCHours()*60+J.getUTCMinutes();J.setUTCMinutes(J.getUTCMinutes()-(N%this._iMinDelta));var P=(K.getTime()-J.getTime())/60000;if(M&&P==0){continue;}var Q=0;var R=0;var T=-1;G=undefined;y=undefined;if(J&&J.getTime()<=F&&K&&K.getTime()>=B){if(z==sap.ui.unified.CalendarIntervalType.Month&&K.getTime()-J.getTime()<604800000){G=g.call(this,J,x,z,I,S,E,B,V);var W=a._createUniversalUTCDate(G.getEndDate(),undefined,true);if(K.getTime()>W.getTime()){y=g.call(this,K,x,z,I,S,E,B,V);}}Q=h.call(this,z,I,S,E,B,J);R=m.call(this,z,I,S,E,B,K);for(j=0;j<O.length;j++){var X=O[j];if(x==X.appointment){T=X.level;}}if(G){G._iBegin=Q;G._iEnd=R;G._iLevel=T;if(y){y._iBegin=Q;y._iEnd=R;y._iLevel=T;}continue;}V.push({appointment:x,begin:Q,end:R,calculatedEnd:R,level:T});if(this._sFocusedAppointmentId&&this._sFocusedAppointmentId==x.getId()){H=true;}}}var Y=this.getAggregation("groupAppointments",[]);if(Y.length>0){for(i=0;i<V.length;i++){x=V[i];if(x.appointment._aAppointments&&x.appointment._aAppointments.length<=1){G=x.appointment;var Z=false;if(G._aAppointments.length==0){Z=true;}else{for(j=0;j<V.length;j++){if(V[j].appointment==G._aAppointments[0]){Z=true;break;}}}if(!Z){for(j=0;j<Y.length;j++){y=Y[j];if(G!=y){for(var k=0;k<y._aAppointments.length;k++){if(G._aAppointments[0]==y._aAppointments[k]){y._aAppointments.splice(k,1);if(y._aAppointments.length==1){this.removeAggregation("groupAppointments",y);y.destroy();Y=this.getAggregation("groupAppointments",[]);}else{y.setProperty("title",y._aAppointments.length,true);}break;}}}}x.begin=G._iBegin;x.end=G._iEnd;x.calculatedEnd=G._iEnd;x.level=G._iLevel;x.appointment=G._aAppointments[0];}else{V.splice(i,1);i--;}this.removeAggregation("groupAppointments",G);G.destroy();Y=this.getAggregation("groupAppointments",[]);}}}if(!H){if(V.length>0){this._sFocusedAppointmentId=V[0].appointment.getId();}else{this._sFocusedAppointmentId=undefined;}}this._aVisibleAppointments=V;return this._aVisibleAppointments;}function g(i,A,I,k,S,E,x,V){var G=this.getAggregation("groupAppointments",[]);var y;var z=c.call(this);var F=z.getFirstDayOfWeek();var B=i.getDay();var H=new U(i.getTime());H.setUTCHours(0);H.setUTCMinutes(0);H.setUTCSeconds(0);H.setUTCMilliseconds(0);if(F<=B){H.setDate(H.getDate()-(B-F));}else{H.setDate(H.getDate()-(7-B-F));}for(var j=0;j<G.length;j++){y=G[j];var J=a._createUniversalUTCDate(y.getStartDate(),undefined,true);if(J.getTime()==H.getTime()){break;}y=undefined;}if(!y){var K=new U(H.getTime());K.setDate(K.getDate()+7);K.setMilliseconds(-1);y=new sap.ui.unified.CalendarAppointment(this.getId()+"-Group"+G.length,{type:A.getType(),startDate:a._createLocalDate(new Date(H.getTime()),true),endDate:a._createLocalDate(new Date(K.getTime()),true)});y._aAppointments=[];this.addAggregation("groupAppointments",y,true);var M=h.call(this,I,k,S,E,x,H);var N=m.call(this,I,k,S,E,x,K);V.push({appointment:y,begin:M,end:N,calculatedEnd:N,level:-1});}y._aAppointments.push(A);if(y.getType()!=sap.ui.unified.CalendarDayType.None&&y.getType()!=A.getType()){y.setType(sap.ui.unified.CalendarDayType.None);}y.setProperty("title",y._aAppointments.length,true);return y;}function h(i,I,S,E,j,A){var B=0;if(i!=sap.ui.unified.CalendarIntervalType.Month){B=100*(A.getTime()-j)/this._iRowSize;}else{var M=new U(A.getTime());M.setUTCDate(1);M.setUTCHours(0);M.setUTCMinutes(0);M.setUTCSeconds(0);M.setUTCMilliseconds(0);var k=new U(M.getTime());k.setUTCMonth(k.getUTCMonth()+1);k.setMilliseconds(-1);var x=k.getTime()-M.getTime();var y=(M.getUTCFullYear()-S.getUTCFullYear())*12+M.getUTCMonth()-S.getUTCMonth();B=(100*y/I)+(100*(A.getTime()-M.getTime())/x)/I;}if(B<0){B=0;}B=Math.round(B*100000)/100000;return B;}function m(i,I,S,E,j,A){var k=0;if(i!=sap.ui.unified.CalendarIntervalType.Month){k=100-(100*(A.getTime()-j)/this._iRowSize);}else{var M=new U(A.getTime());M.setUTCDate(1);M.setUTCHours(0);M.setUTCMinutes(0);M.setUTCSeconds(0);M.setUTCMilliseconds(0);var x=new U(M.getTime());x.setUTCMonth(x.getUTCMonth()+1);x.setMilliseconds(-1);var y=x.getTime()-M.getTime();var z=(M.getUTCFullYear()-S.getUTCFullYear())*12+M.getUTCMonth()-S.getUTCMonth();k=100-((100*z/I)+(100*(A.getTime()-M.getTime())/y)/I);}if(k<0){k=0;}k=Math.round(k*100000)/100000;return k;}function n(){var V=[];if(this.getShowIntervalHeaders()){var A=this.getIntervalHeaders();var k;var I=this.getIntervals();var x=this.getIntervalType();var S=this._getStartDate();var y=S.getTime();var E=this._oUTCEndDate;var z=E.getTime();var i=0;var j=0;for(i=0;i<A.length;i++){k=A[i];var B=a._createUniversalUTCDate(k.getStartDate(),undefined,true);B.setUTCSeconds(0);B.setUTCMilliseconds(0);var F=a._createUniversalUTCDate(k.getEndDate(),undefined,true);F.setUTCSeconds(0);F.setUTCMilliseconds(0);if(B&&B.getTime()<=z&&F&&F.getTime()>=y){var G=new U(S.getTime());var H=new U(S.getTime());H.setUTCMinutes(H.getUTCMinutes()-1);var J=-1;var K=-1;for(j=0;j<I;j++){switch(x){case sap.ui.unified.CalendarIntervalType.Hour:H.setUTCHours(H.getUTCHours()+1);if(j>0){G.setUTCHours(G.getUTCHours()+1);}break;case sap.ui.unified.CalendarIntervalType.Day:H.setUTCDate(H.getUTCDate()+1);if(j>0){G.setUTCDate(G.getUTCDate()+1);}break;case sap.ui.unified.CalendarIntervalType.Month:H.setUTCDate(1);H.setUTCMonth(H.getUTCMonth()+2);H.setUTCDate(0);if(j>0){G.setUTCMonth(G.getUTCMonth()+1);}break;default:throw new Error("Unknown IntervalType: "+x+"; "+this);}if(B&&B.getTime()<=G.getTime()&&F&&F.getTime()>=H.getTime()){if(J<0){J=j;}K=j;}}if(J>=0){V.push({interval:J,appointment:k,last:K});}}}}this._aVisibleIntervalHeaders=V;return this._aVisibleIntervalHeaders;}function o(){var A=this.$("Apps");var R=A.innerWidth();if(R<=0){return;}var $=this.$("DummyApp");var H=$.outerHeight(true);if(H<=0){return;}var M=$.outerWidth();var k=M/R*100;var x=Math.ceil(1000*k)/1000;var y;var z;var S=0;var B=0;var i=0;var E=!sap.ui.Device.system.phone&&this.getAppointmentsReducedHeight();if(this.getShowIntervalHeaders()&&(this.getShowEmptyIntervalHeaders()||this._getVisibleIntervalHeaders().length>0)){S=q(this.$("AppsInt0").children(".sapUiCalendarRowAppsIntHead")[0]).outerHeight(true);}for(i=0;i<this._aVisibleAppointments.length;i++){y=this._aVisibleAppointments[i];z=y.appointment.$();var P=Math.floor(1000*(100-y.calculatedEnd-y.begin))/1000;var F=false;if(P<x){y.end=100-y.begin-k;if(y.end<0){y.end=0;}y.level=-1;F=true;z.addClass("sapUiCalendarAppSmall");}else if(z.hasClass("sapUiCalendarAppSmall")){y.end=y.calculatedEnd;F=true;z.removeClass("sapUiCalendarAppSmall");}if(F){if(this._bRTL){z.css("left",y.end+"%");}else{z.css("right",y.end+"%");}}}for(i=0;i<this._aVisibleAppointments.length;i++){y=this._aVisibleAppointments[i];z=y.appointment.$();var G={};var T=E&&!this._getAppointmentReducedHeight(y.appointment);if(y.level<0){for(var j=0;j<this._aVisibleAppointments.length;j++){var V=this._aVisibleAppointments[j];if(y!=V&&y.begin<(Math.floor(1000*(100-V.end))/1000)&&(Math.floor(1000*(100-y.end))/1000)>V.begin&&V.level>=0){if(G[V.level]){G[V.level]++;}else{G[V.level]=1;}if(E&&!this._getAppointmentReducedHeight(V.appointment)){if(G[V.level+1]){G[V.level+1]++;}else{G[V.level+1]=1;}}}}y.level=0;while(G[y.level]||(T&&G[y.level+1])){y.level++;}z.attr("data-sap-level",y.level);}z.css("top",(H*y.level+S)+"px");var I=y.level;if(T){I++;}if(B<I){B=I;}}B++;H=H*B+S;if(!this.getHeight()){A.outerHeight(H);}else{var J=this.$("Apps").children(".sapUiCalendarRowAppsInt");for(i=0;i<J.length;i++){var K=q(J[i]);K.outerHeight(H);}}$.css("display","none");}function p(A,R){var i=0;var O;if(R){var j=this.getAppointments();var G=this.getAggregation("groupAppointments",[]);q.merge(j,G);for(i=0;i<j.length;i++){O=j[i];if(O.getSelected()){O.setProperty("selected",false,true);O.$().removeClass("sapUiCalendarAppSel");}}}A.setProperty("selected",true,true);A.$().addClass("sapUiCalendarAppSel");if(A._aAppointments){for(i=0;i<A._aAppointments.length;i++){O=A._aAppointments[i];O.setProperty("selected",true,true);}this.fireSelect({appointments:A._aAppointments,multiSelect:!R});}else{this.fireSelect({appointment:A,multiSelect:!R});}}function r(){var A=this.getAppointments();A.sort(function(i,j){var R=i.getStartDate()-j.getStartDate();if(R==0){R=j.getEndDate()-i.getEndDate();}return R;});return A;}function s(I){var G=this.getAggregation("groupAppointments",[]);var k;var F=false;for(var i=0;i<G.length;i++){var x=G[i]._aAppointments;for(var j=0;j<x.length;j++){if(x[j].getId()==I){k=G[i];F=true;break;}}if(F){break;}}return k;}function t(I){if(this._sFocusedAppointmentId!=I){var A=r.call(this);var V=this._aVisibleAppointments;var j;var i=0;j=s.call(this,I);if(j){I=j.getId();j=undefined;}for(i=0;i<V.length;i++){if(V[i].appointment.getId()==I){j=V[i].appointment;break;}}if(j){var O=this.getFocusedAppointment().$();var $=j.$();this._sFocusedAppointmentId=j.getId();O.attr("tabindex","-1");$.attr("tabindex","0");$.focus();}else{for(i=0;i<A.length;i++){if(A[i].getId()==I){j=A[i];break;}}if(j){this._sFocusedAppointmentId=j.getId();var k=e.call(this,j.getStartDate());this.setStartDate(a._createLocalDate(k,true));if(!q.sap.containsOrEquals(this.getDomRef(),document.activeElement)){q.sap.delayedCall(0,this,function(){this.getFocusedAppointment().focus();});}this.fireStartDateChange();}}}}function u(F,S){var I=this._sFocusedAppointmentId;var A=r.call(this);var G=this.getAggregation("groupAppointments",[]);var j;var k=0;var i=0;for(i=0;i<G.length;i++){if(G[i].getId()==I){var x=G[i]._aAppointments;if(F){I=x[x.length-1].getId();}else{I=x[0].getId();}break;}}for(i=0;i<A.length;i++){if(A[i].getId()==I){k=i;break;}}if(F){k=k+S;}else{k=k-S;}if(k<0){k=0;}else if(k>=A.length){k=A.length-1;}j=A[k];t.call(this,j.getId());}function v(E){var A=r.call(this);var j;var S=new U(this._getStartDate());var k=new U(this._oUTCEndDate);var I=this.getIntervalType();var x;var G;S.setUTCHours(0);k.setUTCHours(0);k.setUTCMinutes(0);k.setUTCSeconds(0);switch(I){case sap.ui.unified.CalendarIntervalType.Hour:k.setUTCDate(k.getUTCDate()+1);k.setUTCMilliseconds(-1);break;case sap.ui.unified.CalendarIntervalType.Day:S.setUTCDate(1);k.setUTCMonth(k.getUTCMonth()+1);k.setUTCDate(1);k.setUTCMilliseconds(-1);break;case sap.ui.unified.CalendarIntervalType.Month:S.setUTCMonth(0);S.setUTCDate(1);k.setUTCFullYear(k.getUTCFullYear()+1);k.setUTCMonth(1);k.setUTCDate(1);k.setUTCMilliseconds(-1);break;default:throw new Error("Unknown IntervalType: "+I+"; "+this);}var y=a._createLocalDate(S,true);var z=a._createLocalDate(k,true);for(var i=0;i<A.length;i++){if(A[i].getStartDate()>=y&&A[i].getStartDate()<=z){j=A[i];x=j.getId();if(E.type=="saphome"){break;}}else if(A[i].getStartDate()>z){break;}}G=s.call(this,x);if(G){j=G;x=j.getId();}if(x&&x!=this._sFocusedAppointmentId){t.call(this,x);}else if(E._bPlanningCalendar&&j){j.focus();}else{this.fireLeaveRow({type:E.type});}}function w(i,j){var I=this.getIntervalType();var S=this._getStartDate();var k=new U(S.getTime());var x;var y=false;var z=0;var A=0;if(q(j).hasClass("sapUiCalendarRowAppsSubInt")){y=true;var B=q(q(j).parent()).children(".sapUiCalendarRowAppsSubInt");A=B.length;for(z=0;z<A;z++){var E=B[z];if(E==j){break;}}}switch(I){case sap.ui.unified.CalendarIntervalType.Hour:k.setUTCHours(k.getUTCHours()+i);if(y){k.setUTCMinutes(k.getUTCMinutes()+z*60/A);x=new U(k.getTime());x.setUTCMinutes(x.getUTCMinutes()+60/A);}else{x=new U(k.getTime());x.setUTCHours(x.getUTCHours()+1);}break;case sap.ui.unified.CalendarIntervalType.Day:k.setUTCDate(k.getUTCDate()+i);if(y){k.setUTCHours(k.getUTCHours()+z*24/A);x=new U(k.getTime());x.setUTCHours(x.getUTCHours()+24/A);}else{x=new U(k.getTime());x.setUTCDate(x.getUTCDate()+1);}break;case sap.ui.unified.CalendarIntervalType.Month:k.setUTCMonth(k.getUTCMonth()+i);if(y){k.setUTCDate(k.getUTCDate()+z);x=new U(k.getTime());x.setUTCDate(x.getUTCDate()+1);}else{x=new U(k.getTime());x.setUTCMonth(x.getUTCMonth()+1);}break;default:throw new Error("Unknown IntervalType: "+I+"; "+this);}x.setUTCMilliseconds(x.getUTCMilliseconds()-1);k=a._createLocalDate(k,true);x=a._createLocalDate(x,true);this.fireIntervalSelect({startDate:k,endDate:x,subInterval:y});}return b;},true);
