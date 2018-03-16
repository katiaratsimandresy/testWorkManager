/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/TreeBinding','sap/ui/model/ClientTreeBinding','./TreeBindingAdapter','sap/ui/table/TreeAutoExpandMode','sap/ui/model/ChangeReason'],function(q,T,C,a,b,c){"use strict";var d=function(){if(!(this instanceof T)||this._bIsAdapted){return;}a.apply(this);for(var f in d.prototype){if(d.prototype.hasOwnProperty(f)){this[f]=d.prototype[f];}}this._invalidTree=true;this.setNumberOfExpandedLevels(this.mParameters.numberOfExpandedLevels||0);};d.prototype.setNumberOfExpandedLevels=function(n){this._iNumberOfExpandedLevels=parseInt(n,10);};d.prototype.getNumberOfExpandedLevels=function(){return this._iNumberOfExpandedLevels;};d.prototype.nodeHasChildren=function(n){if(!n){return false;}else if(n.isArtificial){return true;}else{return C.prototype.hasChildren.call(this,n.context);}};d.prototype.resetData=function(o,p){var r=C.prototype.resetData.call(this,o,p);this._aRowIndexMap=[];this._oRootNode=undefined;this._iPageSize=0;this._iThreshold=0;if(!p||p.reason!==c.Sort){this.clearSelection();this._createTreeState(true);}return r;};d.prototype._calculateGroupID=function(n){var B=this.getPath();var g;if(n.context){var s=n.context.getPath();if(B!="/"){var m=s.match(B+"(.*)");if(m!=null&&m[1]){g=m[1];}else{q.sap.log.warning("CTBA: BindingPath/ContextPath matching problem!");}}if(!g){g=s;}if(q.sap.startsWith(g,"/")){g=g.substring(1,g.length);}g=n.parent.groupID+g.replace(/\//g,"_")+"/";}else if(n.context===null){g="/";}return g;};d.prototype.expand=function(){this._buildTree();a.prototype.expand.apply(this,arguments);};d.prototype.collapse=function(){this._buildTree();a.prototype.collapse.apply(this,arguments);};d.prototype._buildTree=function(s,l){if(this._invalidTree){s=s||0;l=l||this.getRootContexts().length;this._invalidTree=false;this._aRowIndexMap=[];a.prototype._buildTree.call(this,s,l);}};d.prototype.findNode=function(){this._buildTree();return a.prototype.findNode.apply(this,arguments);};d.prototype.setSelectedIndex=function(){this._buildTree();return a.prototype.setSelectedIndex.apply(this,arguments);};d.prototype.setSelectionInterval=function(){this._buildTree();return a.prototype.setSelectionInterval.apply(this,arguments);};d.prototype.addSelectionInterval=function(){this._buildTree();a.prototype.addSelectionInterval.apply(this,arguments);};d.prototype.removeSelectionInterval=function(){this._buildTree();a.prototype.removeSelectionInterval.apply(this,arguments);};d.prototype.clearSelection=function(){this._buildTree();a.prototype.clearSelection.apply(this,arguments);};d.prototype.selectAll=function(){this._buildTree();a.prototype.selectAll.apply(this,arguments);};d.prototype._calculateRequestLength=function(m,s){return m;};d.prototype.getLength=function(){this._buildTree();return a.prototype.getLength.apply(this,arguments);};d.prototype._fireChange=function(){this._invalidTree=true;this.constructor.prototype._fireChange.apply(this,arguments);};return d;},true);
