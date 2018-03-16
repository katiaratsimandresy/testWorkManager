/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/m/Text','sap/ui/core/HTML','sap/ui/core/Icon','sap/ui/core/IconPool'],function(q,l,C,T,H,I){"use strict";var G=C.extend("sap.m.GenericTile",{metadata:{library:"sap.m",properties:{"mode":{type:"sap.m.GenericTileMode",group:"Appearance",defaultValue:sap.m.GenericTileMode.ContentMode},"header":{type:"string",group:"Appearance",defaultValue:null},"subheader":{type:"string",group:"Appearance",defaultValue:null},"failedText":{type:"string",group:"Appearance",defaultValue:null},"size":{type:"sap.m.Size",group:"Misc",defaultValue:sap.m.Size.Auto},"frameType":{type:"sap.m.FrameType",group:"Misc",defaultValue:sap.m.FrameType.OneByOne},"backgroundImage":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"headerImage":{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},"state":{type:"sap.m.LoadState",group:"Misc",defaultValue:sap.m.LoadState.Loaded},"imageDescription":{type:"string",group:"Misc",defaultValue:null}},aggregations:{"tileContent":{type:"sap.m.TileContent",multiple:true,bindable:"bindable"},"icon":{type:"sap.ui.core.Control",multiple:false},"_titleText":{type:"sap.m.Text",multiple:false,visibility:"hidden"},"_failedMessageText":{type:"sap.m.Text",multiple:false,visibility:"hidden"}},events:{"press":{}}}});G.prototype.init=function(){this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oTitle=new T(this.getId()+"-title");this._oTitle.addStyleClass("sapMGTTitle");this._oTitle.cacheLineHeight=false;this.setAggregation("_titleText",this._oTitle,true);this._sFailedToLoad=this._rb.getText("INFOTILE_CANNOT_LOAD_TILE");this._sLoading=this._rb.getText("INFOTILE_LOADING");this._oFailedText=new T(this.getId()+"-failed-txt",{maxLines:2});this._oFailedText.cacheLineHeight=false;this._oFailedText.addStyleClass("sapMGTFailed");this.setAggregation("_failedMessageText",this._oFailedText,true);this._oWarningIcon=new I(this.getId()+"-warn-icon",{src:"sap-icon://notification",size:"1.37rem"});this._oWarningIcon.addStyleClass("sapMGTFtrFldIcnMrk");this._oBusy=new H(this.getId()+"-overlay");this._oBusy.setBusyIndicatorDelay(0);this._bThemeApplied=true;if(!sap.ui.getCore().isInitialized()){this._bThemeApplied=false;sap.ui.getCore().attachInit(this._handleCoreInitialized.bind(this));}else{this._handleCoreInitialized();}};G.prototype._handleCoreInitialized=function(){this._bThemeApplied=sap.ui.getCore().isThemeApplied();if(!this._bThemeApplied){sap.ui.getCore().attachThemeChanged(this._handleThemeApplied,this);}};G.prototype._handleThemeApplied=function(){this._bThemeApplied=true;this._oTitle.clampHeight();sap.ui.getCore().detachThemeChanged(this._handleThemeApplied,this);};G.prototype.onBeforeRendering=function(){var s=this.getSubheader()?true:false;if(this.getMode()===l.GenericTileMode.HeaderMode){this._applyHeaderMode(s);}else{this._applyContentMode(s);}var t=this.getTileContent().length;for(var i=0;i<t;i++){this.getTileContent()[i].setDisabled(this.getState()==sap.m.LoadState.Disabled);}this._generateFailedText();this.$().unbind("mouseenter",this._updateAriaAndTitle);this.$().unbind("mouseleave",this._removeTooltipFromControl);};G.prototype.onAfterRendering=function(){this.$().bind("mouseenter",this._updateAriaAndTitle.bind(this));this.$().bind("mouseleave",this._removeTooltipFromControl.bind(this));};G.prototype.exit=function(){this._oWarningIcon.destroy();if(this._oImage){this._oImage.destroy();}this._oBusy.destroy();};G.prototype.ontouchstart=function(){if(this.$("hover-overlay").length>0){this.$("hover-overlay").addClass("sapMGTPressActive");}if(sap.ui.Device.browser.internet_explorer&&this.getState()!==sap.m.LoadState.Disabled){this.$().focus();}};G.prototype.ontouchcancel=function(){if(this.$("hover-overlay").length>0){this.$("hover-overlay").removeClass("sapMGTPressActive");}};G.prototype.ontouchend=function(){if(this.$("hover-overlay").length>0){this.$("hover-overlay").removeClass("sapMGTPressActive");}if(sap.ui.Device.browser.internet_explorer&&this.getState()!==sap.m.LoadState.Disabled){this.$().focus();}};G.prototype.ontap=function(e){if(this.getState()!==sap.m.LoadState.Disabled){if(sap.ui.Device.browser.internet_explorer){this.$().focus();}this.firePress();e.preventDefault();}};G.prototype.onkeydown=function(e){if(q.sap.PseudoEvents.sapselect.fnCheck(e)&&this.getState()!==sap.m.LoadState.Disabled){if(this.$("hover-overlay").length>0){this.$("hover-overlay").addClass("sapMGTPressActive");}e.preventDefault();}};G.prototype.onkeyup=function(e){if(q.sap.PseudoEvents.sapselect.fnCheck(e)&&this.getState()!==sap.m.LoadState.Disabled){if(this.$("hover-overlay").length>0){this.$("hover-overlay").removeClass("sapMGTPressActive");}this.firePress();e.preventDefault();}};G.prototype.getHeader=function(){return this._oTitle.getText();};G.prototype.setHeader=function(t){this._oTitle.setText(t);return this;};G.prototype.setHeaderImage=function(u){var v=!q.sap.equal(this.getHeaderImage(),u);if(v){if(this._oImage){this._oImage.destroy();this._oImage=undefined;}if(u){this._oImage=sap.ui.core.IconPool.createControlByURI({id:this.getId()+"-icon-image",src:u},sap.m.Image);this._oImage.addStyleClass("sapMGTHdrIconImage");}}return this.setProperty("headerImage",u);};G.prototype._applyHeaderMode=function(s){if(s){this._oTitle.setMaxLines(4);}else{this._oTitle.setMaxLines(5);}this._changeTileContentContentVisibility(false);};G.prototype._applyContentMode=function(s){if(s){this._oTitle.setMaxLines(2);}else{this._oTitle.setMaxLines(3);}this._changeTileContentContentVisibility(true);};G.prototype._changeTileContentContentVisibility=function(v){var t;t=this.getTileContent();for(var i=0;i<t.length;i++){t[i].setRenderContent(v);}};G.prototype._getHeaderAriaAndTooltipText=function(){var t="";var i=true;if(this.getHeader()){t+=this.getHeader();i=false;}if(this.getSubheader()){t+=(i?"":"\n")+this.getSubheader();i=false;}if(this.getImageDescription()){t+=(i?"":"\n")+this.getImageDescription();}return t;};G.prototype._getContentAriaAndTooltipText=function(){var t="";var b=true;var a=this.getTileContent();for(var i=0;i<a.length;i++){if(q.isFunction(a[i]._getAriaAndTooltipText)){t+=(b?"":"\n")+a[i]._getAriaAndTooltipText();}else if(a[i].getTooltip_AsString()){t+=(b?"":"\n")+a[i].getTooltip_AsString();}b=false;}return t;};G.prototype._getAriaAndTooltipText=function(){var a=(this.getTooltip_AsString()&&!this._isTooltipSuppressed())?this.getTooltip_AsString():(this._getHeaderAriaAndTooltipText()+"\n"+this._getContentAriaAndTooltipText());switch(this.getState()){case sap.m.LoadState.Disabled:return"";case sap.m.LoadState.Loading:return a+"\n"+this._sLoading;case sap.m.LoadState.Failed:return a+"\n"+this._oFailedText.getText();default:if(q.trim(a).length===0){return"";}else{return a;}}};G.prototype._getAriaText=function(){var a=this.getTooltip_Text();if(!a||this._isTooltipSuppressed()){a=this._getAriaAndTooltipText();}return a;};G.prototype._getTooltipText=function(){var t=this.getTooltip_Text();if(this._isTooltipSuppressed()===true){t=null;}return t;};G.prototype._checkFooter=function(t,c){if(c.getProperty("state")===sap.m.LoadState.Failed){t.setRenderFooter(false);}else{t.setRenderFooter(true);}};G.prototype._generateFailedText=function(){var c=this.getFailedText();var f=c?c:this._sFailedToLoad;this._oFailedText.setText(f);this._oFailedText.setTooltip(f);};G.prototype._isTooltipSuppressed=function(){var t=this.getTooltip_Text();if(t&&t.length>0&&q.trim(t).length===0){return true;}else{return false;}};G.prototype._isHeaderTextTruncated=function(){var d,m;d=this.getAggregation("_titleText").getDomRef("inner");m=this.getAggregation("_titleText").getClampHeight(d);if(d&&m<d.scrollHeight){return true;}else{return false;}};G.prototype._isSubheaderTextTruncated=function(){var s=this.$("subHdr-text");if(s&&s.length&&s[0].offsetWidth<s[0].scrollWidth){return true;}else{return false;}};G.prototype._setTooltipFromControl=function(){var c,t="";var b=true;var a=this.getTileContent();if(this._isHeaderTextTruncated()){t=this._oTitle.getText();b=false;}if(this._isSubheaderTextTruncated()){t+=(b?"":"\n")+this.getSubheader();b=false;}for(var i=0;i<a.length;i++){c=a[i].getContent();if(c&&c.getMetadata().getLibraryName()==="sap.suite.ui.microchart"){t+=(b?"":"\n")+c.getTooltip_AsString();}b=false;}if(t&&!this._getTooltipText()&&!this._isTooltipSuppressed()){this.$().attr("title",t);this._bTooltipFromControl=true;}};G.prototype._updateAriaAndTitle=function(){var a=this._getAriaAndTooltipText();var A=this._getAriaText();var t=this.$();if(t.attr("title")!==a){t.attr("aria-label",A);}t.find('*').removeAttr("aria-label").removeAttr("title").unbind("mouseenter");this._setTooltipFromControl();};G.prototype._removeTooltipFromControl=function(){if(this._bTooltipFromControl){this.$().removeAttr("title");this._bTooltipFromControl=false;}};return G;},true);
