/**
 * @class 
 * @inherits inputEx.Group
 */
inputEx.GroupBuilder = function(options) {
   options.fields = inputEx.Group.groupOptions;
   inputEx.GroupBuilder.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.GroupBuilder, inputEx.Group, {
   
   initEvents: function() {
      // Update the preview event
      this.updatedEvt.subscribe(this.rebuildPreview, this, true);
   },
   
   rebuildPreview: function() {      
      var value = this.getValue();

      this._group = new inputEx.Group(value);
      
      var groupContainer = YAHOO.util.Dom.get('groupContainer');
      groupContainer.innerHTML = "";
      groupContainer.appendChild(this._group.getEl());
      
      var codeContainer = YAHOO.util.Dom.get('codeGenerator');
      codeContainer.innerHTML = value.toPrettyJSONString(true);
   },
   
   setValue: function(value) {
      inputEx.GroupBuilder.superclass.setValue.call(this, value);
      this.rebuildPreview();
   }
   
});


YAHOO.util.Event.addListener(window, 'load', function() {
   new inputEx.GroupBuilder({parentEl: 'container', value: {
   	"fields" : [
   		{
   			"type" : "string",
   			"label" : "Nom",
   			"inputParams" : {
   				"name" : "name",
   				"required" : true,
   				"tooltipIcon" : false,
   				"value" : "",
   				"messages" : {
   					"required" : "This field is required",
   					"invalid" : "This field is invalid",
   					"valid" : "This field is valid"
   				},
   				"className" : "inputEx-Field",
   				"size" : 20
   			}
   		},
   		{
   			"type" : "string",
   			"label" : "Prénom",
   			"inputParams" : {
   				"name" : "firstname",
   				"required" : true,
   				"tooltipIcon" : false,
   				"value" : "",
   				"messages" : {
   					"required" : "This field is required",
   					"invalid" : "This field is invalid",
   					"valid" : "This field is valid"
   				},
   				"className" : "inputEx-Field",
   				"size" : 20
   			}
   		},
   		{
   			"type" : "email",
   			"label" : "Email",
   			"inputParams" : {
   				"name" : "",
   				"tooltipIcon" : true,
   				"value" : "",
   				"messages" : {
   					"required" : "This field is required",
   					"invalid" : "Invalid email, ex: sample@test.com",
   					"valid" : "This field is valid"
   				},
   				"className" : "inputEx-Field",
   				"required" : false,
   				"size" : 20
   			}
   		},
   		{
   			"type" : "list",
   			"label" : "Colors",
   			"inputParams" : {
   				"elementType" : {
   					"type" : "color",
   					"inputParams" : {
   						"name" : "",
   						"tooltipIcon" : false
   					}
   				},
   				"listLabel" : "",
   				"name" : "",
   				"tooltipIcon" : false,
   				"value" : [

   				],
   				"messages" : {
   					"required" : "This field is required",
   					"invalid" : "This field is invalid",
   					"valid" : "This field is valid"
   				},
   				"className" : "inputEx-Field inputEx-ListField",
   				"required" : false,
   				"sortable" : false
   			}
   		}
   	],
   	"collapsible" : true,
   	"legend" : "User"
   }
   
   });
});

inputEx.spacerUrl = "../images/space.gif";