(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class Meta field providing in place editing (the editor appears when you click on the formatted value). Options:
 * - formatDom
 * - formatValue
 * - ou texte...
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.InPlaceEdit = function(options) {
   inputEx.InPlaceEdit.superclass.constructor.call(this, options);
};

lang.extend(inputEx.InPlaceEdit, inputEx.Field, 
/**
 * @scope inputEx.InPlaceEdit.prototype   
 */   
{

   /**
    * Override render to create 2 divs: the visualization one, and the edit in place form
    */
   render: function() {
      
	   // Create a DIV element to wrap the editing el and the image
	   this.divEl = inputEx.cn('div', {className: this.options.className});
   	
      this.renderVisuDiv();
	   
	   this.renderEditor();
   },
   
   /**
    * Render the editor
    */
   renderEditor: function() {
      
      this.editorContainer = inputEx.cn('div', null, {display: 'none'});
      
      // Render the editor field
      this.editorField = inputEx.buildField(this.options.editorField);
   
      this.editorContainer.appendChild( this.editorField.getEl() );
      Dom.setStyle(this.editorField.getEl(), 'float', 'left');
      
      this.okButton = inputEx.cn('input', {type: 'button', value: 'Ok'});
      Dom.setStyle(this.okButton, 'float', 'left');
      this.editorContainer.appendChild(this.okButton);
      
      this.cancelLink = inputEx.cn('a', null, null, "cancel");
      this.cancelLink.href = ""; // IE required (here, not in the cn fct)
      Dom.setStyle(this.cancelLink, 'float', 'left');
      this.editorContainer.appendChild(this.cancelLink);
      
      // Line breaker
      this.editorContainer.appendChild( inputEx.cn('div',null, {clear: 'both'}) );
      
      this.divEl.appendChild(this.editorContainer);
   },
      
   onVisuMouseOver: function() {
      if(this.colorAnim) {
         this.colorAnim.stop(true);
      }
      inputEx.sn(this.formattedContainer, null, {backgroundColor: '#eeee33' });
   },
   
   onVisuMouseOut: function() {
      // Start animation
      if(this.colorAnim) {
         this.colorAnim.stop(true);
      }
      this.colorAnim = new YAHOO.util.ColorAnim(this.formattedContainer, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 1);
      this.colorAnim.onComplete.subscribe(function() { Dom.setStyle(this.formattedContainer, 'background-color', ''); }, this, true);
      this.colorAnim.animate();   
   },
   
   /**
    * Create the div that will contain the visualization of the value
    */
   renderVisuDiv: function() {
      this.formattedContainer = inputEx.cn('div', {className: 'inputEx-InPlaceEdit-formattedContainer'});
      
      if( lang.isFunction(this.options.formatDom) ) {
         this.formattedContainer.appendChild( this.options.formatDom(this.options.value) );
      }
      else if( lang.isFunction(this.options.formatValue) ) {
         this.formattedContainer.innerHTML = this.options.formatValue(this.options.value);
      }
      else {
         this.formattedContainer.innerHTML = lang.isUndefined(this.options.value) ? inputEx.messages.emptyInPlaceEdit: this.options.value;
      }
      
      this.divEl.appendChild(this.formattedContainer);
   },
   
initEvents: function() {  
   Event.addListener(this.formattedContainer, "click", this.openEditor, this, true);
            
   // For color animation
   Event.addListener(this.formattedContainer, 'mouseover', this.onVisuMouseOver, this, true);
   Event.addListener(this.formattedContainer, 'mouseout', this.onVisuMouseOut, this, true);
         
   // Editor: 
   Event.addListener(this.okButton, 'click', this.onOkEditor, this, true);
   Event.addListener(this.cancelLink, 'click', this.onCancelEditor, this, true);
         
   if(this.editorField.el) {
      // Register some listeners
      Event.addListener(this.editorField.el, "keyup", this.onKeyUp, this, true);
      Event.addListener(this.editorField.el, "keydown", this.onKeyDown, this, true);
      // BLur
      Event.addListener(this.editorField.el, "blur", this.onCancelEditor, this, true);
   }
},
   
onKeyUp: function(e) {
   // Enter
   if( e.keyCode == 13) {
      this.onOkEditor();
   }
   // Escape
   if( e.keyCode == 27) {
      this.onCancelEditor(e);
   }
},
   
onKeyDown: function(e) {
   // Tab
   if(e.keyCode == 9) {
      this.onOkEditor();
   }
},
   
onOkEditor: function() {
   var newValue = this.editorField.getValue();
   this.setValue(newValue);
      
   this.editorContainer.style.display = 'none';
   this.formattedContainer.style.display = '';
      
   var that = this;
   setTimeout(function() {that.updatedEvt.fire(newValue);}, 50);      
},
   
onCancelEditor: function(e) {
   Event.stopEvent(e);
   this.editorContainer.style.display = 'none';
   this.formattedContainer.style.display = '';
},
   
   
openEditor: function() {
   var value = this.getValue();
   this.editorContainer.style.display = '';
   this.formattedContainer.style.display = 'none';
   
   if(!lang.isUndefined(value)) {
      this.editorField.setValue(value);   
   }
      
   // Set focus in the element !
   this.editorField.focus();
   
   // Select the content
   if(this.editorField.el && lang.isFunction(this.editorField.el.setSelectionRange) && (!!value && !!value.length)) {
      this.editorField.el.setSelectionRange(0,value.length);
   }
      
},
   
   /**
    * Returned the previously stored value
    */
   getValue: function() {
	   return this.value;
   },

   /**
    * Set the value and update the display
    */
   setValue: function(value) {   
      // Store the value
	   this.value = value;
   
      if(lang.isUndefined(value) || value == "") {
         this.value = "(Edit me)";
      }
      inputEx.renderVisu(this.options.visu, this.value, this.formattedContainer);
   }

});
  
inputEx.messages.emptyInPlaceEdit = "(click to edit)";

/**
 * Register this class as "inplaceedit" type
 */
inputEx.registerType("inplaceedit", inputEx.InPlaceEdit);

})();