/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/m/Text","sap/m/Link","sap/m/Select","sap/ui/core/Item","sap/ui/core/delegate/ItemNavigation","sap/ui/core/ResizeHandler","sap/ui/core/IconPool","sap/ui/Device"],function(C,T,L,S,I,a,R,b,D){"use strict";var B=C.extend("sap.m.Breadcrumbs",{metadata:{library:"sap.m",properties:{currentLocationText:{type:"string",group:"Behavior",defaultValue:null}},aggregations:{links:{type:"sap.m.Link",multiple:true,singularName:"link"},_currentLocation:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_select:{type:"sap.m.Select",multiple:false,visibility:"hidden"}},defaultAggregation:"links"}});B.prototype.onBeforeRendering=function(){if(this._bControlsInfoCached){this._updateSelect(true);}};B.prototype.onAfterRendering=function(){if(!this._bControlsInfoCached){this._updateSelect(true);return;}this._configureKeyboardHandling();};B.prototype.onThemeChanged=function(){this._resetControl();};B.prototype.exit=function(){this._resetControl();this._destroyItemNavigation();};B.PAGEUP_AND_PAGEDOWN_JUMP_SIZE=5;B._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.m");};B.prototype._getAugmentedId=function(s){return this.getId()+"-"+s;};B.prototype._getSelect=function(){if(!this.getAggregation("_select")){this.setAggregation("_select",this._decorateSelect(new S({id:this._getAugmentedId("select"),change:this._selectChangeHandler.bind(this),forceSelection:false,autoAdjustWidth:true,icon:b.getIconURI("slim-arrow-down"),type:sap.m.SelectType.IconOnly})));}return this.getAggregation("_select");};B.prototype._getCurrentLocation=function(){if(!this.getAggregation("_currentLocation")){this.setAggregation("_currentLocation",new T({id:this._getAugmentedId("currentText"),text:this.getCurrentLocationText(),wrapping:false}).addStyleClass("sapMBreadcrumbsCurrentLocation"));}return this.getAggregation("_currentLocation");};function c(A,d){var e=Array.prototype.slice.apply(d);e.unshift(A);return e;}B.prototype.insertLink=function(l,i){var r=this.insertAggregation.apply(this,c("links",arguments));this._registerControlListener(l);this._resetControl();return r;};B.prototype.addLink=function(l){var r=this.addAggregation.apply(this,c("links",arguments));this._registerControlListener(l);this._resetControl();return r;};B.prototype.removeLink=function(o){var r=this.removeAggregation.apply(this,c("links",arguments));this._deregisterControlListener(r);this._resetControl();return r;};B.prototype.removeAllLinks=function(){var l=this.getAggregation("links");var r=this.removeAllAggregation.apply(this,c("links",arguments));l.forEach(this._deregisterControlListener,this);this._resetControl();return r;};B.prototype.destroyLinks=function(){var l=this.getAggregation("links");var r=this.destroyAggregation.apply(this,c("links",arguments));l.forEach(this._deregisterControlListener,this);this._resetControl();return r;};B.prototype._decorateSelect=function(s){s.getPicker().attachAfterOpen(this._removeItemNavigation,this).attachBeforeClose(this._restoreItemNavigation,this);s._onBeforeOpenDialog=this._onSelectBeforeOpenDialog.bind(this);s._onBeforeOpenPopover=this._onSelectBeforeOpenPopover.bind(this);s.onsapescape=this._onSelectEscPress.bind(this);return s;};B.prototype._removeItemNavigation=function(){this.removeDelegate(this._getItemNavigation());};B.prototype._onSelectBeforeOpenDialog=function(){var s=this._getSelect();if(this.getCurrentLocationText()&&D.system.phone){s.setSelectedIndex(0);}else{s.setSelectedItem(null);s.getPicker().getCustomHeader().getContentLeft()[0].setValue(null);}S.prototype._onBeforeOpenDialog.call(s);this._removeItemNavigation();};B.prototype._onSelectBeforeOpenPopover=function(){this._getSelect().setSelectedItem(null);this._removeItemNavigation();};B.prototype._restoreItemNavigation=function(){this.addDelegate(this._getItemNavigation());};B.prototype._onSelectEscPress=function(){this._getSelect().close();};B.prototype._createSelectItem=function(i){return new I({key:i.getId(),text:i.getText()});};B.prototype._selectChangeHandler=function(e){var l,s,d,o=e.getParameter("selectedItem");if(!o){return;}if(!this._getSelect().isOpen()){return;}l=sap.ui.getCore().byId(o.getKey());if(!(l instanceof L)){return;}s=l.getHref();d=l.getTarget();l.firePress();if(s){if(d){window.open(s,d);}else{window.location.href=s;}}};B.prototype._getItemsForMobile=function(){var i=this.getLinks();if(this.getCurrentLocationText()){i.push(this._getCurrentLocation());}return i;};B.prototype._updateSelect=function(i){var s=this._getSelect(),d,o=this._getControlDistribution();if(!this._bControlDistributionCached||i){s.removeAllItems();d=D.system.phone?this._getItemsForMobile():o.aControlsForSelect;d.map(this._createSelectItem).reverse().forEach(s.insertItem,s);this._bControlDistributionCached=true;this.invalidate(this);}s.setVisible(!!o.aControlsForSelect.length);if(!this._sResizeListenerId){this._sResizeListenerId=R.register(this,this._handleScreenResize.bind(this));}};B.prototype._getControlsForBreadcrumbTrail=function(){var v;if(this._bControlDistributionCached&&this._oDistributedControls){return this._oDistributedControls.aControlsForBreadcrumbTrail;}v=this.getLinks().filter(function(l){return l.getVisible();});if(this.getCurrentLocationText()){return v.concat([this._getCurrentLocation()]);}return v;};B.prototype._getControlInfo=function(o){return{id:o.getId(),control:o,width:o.$().parent().outerWidth(true),bCanOverflow:o instanceof L};};B.prototype._getControlDistribution=function(m){m=m||this._iContainerSize;this._iContainerSize=m;this._oDistributedControls=this._determineControlDistribution(m);return this._oDistributedControls;};B.prototype._determineControlDistribution=function(m){var i,o,d=this._getControlsInfo().aControlInfo,s=this._iSelectWidth,e=[],f=[],u=s;for(i=d.length-1;i>=0;i--){o=d[i];u+=o.width;if(d.length-1===i){f.push(o.control);continue;}if(i===0){u-=s;}if(u>m&&o.bCanOverflow){e.unshift(o.control);}else{f.unshift(o.control);}}return{aControlsForBreadcrumbTrail:f,aControlsForSelect:e};};B.prototype._getControlsInfo=function(){if(!this._bControlsInfoCached){this._iSelectWidth=this._getSelect().$().parent().outerWidth(true)||0;this._aControlInfo=this._getControlsForBreadcrumbTrail().map(this._getControlInfo);this._iContainerSize=this.$().outerWidth(true);this._bControlsInfoCached=true;}return{aControlInfo:this._aControlInfo,iSelectWidth:this._iSelectWidth,iContentSize:this._iContainerSize};};B.prototype._handleScreenResize=function(e){var i=this._oDistributedControls.aControlsForBreadcrumbTrail.length,o=this._getControlDistribution(e.size.width),d=o.aControlsForBreadcrumbTrail.length;if(i!==d){this._updateSelect(true);}return this;};B.prototype._getItemsToNavigate=function(){var i=this._getControlsForBreadcrumbTrail().slice(),s=this._getSelect();if(s.getVisible()){i.unshift(s);}return i;};B.prototype._getItemNavigation=function(){if(!this._itemNavigation){this._itemNavigation=new a();}return this._itemNavigation;};B.prototype._destroyItemNavigation=function(){if(this._itemNavigation){this.removeEventDelegate(this._itemNavigation);this._itemNavigation.destroy();this._itemNavigation=null;}};B.prototype._configureKeyboardHandling=function(){var i=this._getItemNavigation(),s=-1,d=this._getItemsToNavigate(),n=[];d.forEach(function(o,e){if(e===0){o.$().attr("tabIndex","0");}o.$().attr("tabIndex","-1");n.push(o.getDomRef());});this.addDelegate(i);i.setCycling(false);i.setPageSize(B.PAGEUP_AND_PAGEDOWN_JUMP_SIZE);i.setRootDomRef(this.getDomRef());i.setItemDomRefs(n);i.setSelectedIndex(s);return this;};B.prototype._registerControlListener=function(o){if(o){o.attachEvent("_change",this._resetControl,this);}};B.prototype._deregisterControlListener=function(o){if(o){o.detachEvent("_change",this._resetControl,this);}};B.prototype.setCurrentLocationText=function(t){var o=this._getCurrentLocation(),r=this.setProperty("currentLocationText",t,true);if(o.getText()!==t){o.setText(t);this._resetControl();}return r;};B.prototype._resetControl=function(){this._aControlInfo=null;this._iContainerSize=null;this._bControlsInfoCached=null;this._bControlDistributionCached=null;this._oDistributedControls=null;if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}this.removeDelegate(this._getItemNavigation());this.invalidate(this);return this;};return B;},true);
