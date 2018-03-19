/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/Renderer'],function(q,l,C,R){"use strict";var O=C.extend("sap.m.ObjectNumber",{metadata:{library:"sap.m",properties:{number:{type:"string",group:"Misc",defaultValue:null},numberUnit:{type:"string",group:"Misc",defaultValue:null,deprecated:true},emphasized:{type:"boolean",group:"Appearance",defaultValue:true},state:{type:"sap.ui.core.ValueState",group:"Misc",defaultValue:sap.ui.core.ValueState.None},unit:{type:"string",group:"Misc",defaultValue:null},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}}}});O.prototype._sCSSPrefixObjNumberStatus='sapMObjectNumberStatus';O.prototype.setState=function(s){this.$().removeClass(this._sCSSPrefixObjNumberStatus+this.getState());this.setProperty("state",s,true);this.$().addClass(this._sCSSPrefixObjNumberStatus+this.getState());return this;};O.prototype.setTextAlign=function(a){var A=R.getTextAlign(a,this.getTextDirection());this.setProperty("textAlign",a,true);A=A||a;this.$().css("text-align",a);return this;};return O;},true);