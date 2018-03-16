/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','sap/ui/core/LabelEnablement'],function(q,R,L){"use strict";var a={};a.render=function(r,c){var t=c.getTextDirection(),T=R.getTextAlign(c.getTextAlign(),t),s=c.getAriaLabelledBy().indexOf(c.getId())===-1&&(c.getAriaLabelledBy().length>0||L.getReferencingLabels(c).length>0||(c.getParent()&&c.getParent().enhanceAccessibilityState)),A={role:'link',labelledby:s?{value:c.getId(),append:true}:undefined};r.write("<a");r.writeControlData(c);r.addClass("sapMLnk");if(c.getSubtle()){r.addClass("sapMLnkSubtle");if(A.describedby){A.describedby+=" "+c._sAriaLinkSubtleId;}else{A.describedby=c._sAriaLinkSubtleId;}}if(c.getEmphasized()){r.addClass("sapMLnkEmphasized");if(A.describedby){A.describedby+=" "+c._sAriaLinkEmphasizedId;}else{A.describedby=c._sAriaLinkEmphasizedId;}}if(!c.getEnabled()){r.addClass("sapMLnkDsbl");r.writeAttribute("disabled","true");r.writeAttribute("tabIndex","-1");}else if(c.getText()){r.writeAttribute("tabIndex","0");}else{r.writeAttribute("tabIndex","-1");}if(c.getWrapping()){r.addClass("sapMLnkWrapping");}if(c.getTooltip_AsString()){r.writeAttributeEscaped("title",c.getTooltip_AsString());}if(c.getHref()&&c.getEnabled()){r.writeAttributeEscaped("href",c.getHref());}else{r.writeAttribute("href","javascript:void(0);");}if(c.getTarget()){r.writeAttributeEscaped("target",c.getTarget());}if(c.getWidth()){r.addStyle("width",c.getWidth());}else{r.addClass("sapMLnkMaxWidth");}if(T){r.addStyle("text-align",T);}if(t!==sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",t.toLowerCase());}r.writeAccessibilityState(c,A);r.writeClasses();r.writeStyles();r.write(">");this.renderText(r,c);r.write("</a>");};a.renderText=function(r,c){r.writeEscaped(c.getText());};return a;},true);
