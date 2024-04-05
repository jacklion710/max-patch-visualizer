# Max Patch Visualizer Requirements & Notes

*Web tool for visualizing Max patches online.*

The purpose of this project is to provide a tool for users of Max MSP, a popular patching based environment for various multimedia programming tasks. It is a popular tool for creative coders who want a similar experience to coding with a ton of objects which many programmers will find familiar. They have lists, matrices, operators, etc... you can even write Javascript and use node in Max! If you want to learn more about Max its worth searching up but for the sake of these project this is all we need to know in order to understand what problem this project aims to solve. 

## Max Patches Are Really JSON 

Even though Max is a visual node based patcher environment when a section of a patch is copied to the clipboard it is copied not as a JSON object which contains information thats used for reconstructing the copied patch when pasted back into max. However, if we copy and paste this into a text editor we can see the JSON object that represents the patch. 

### Single Object in JSON

![!\[\[./single-cycle~.png\]\]](https://raw.githubusercontent.com/jacklion710/max-patch-visualizer/main/patch-visualizer-notes/single-cycle~.png)

In max we have access to a vast library for DSP and realtime control systems. One of the most basic things you can do with digital audio is to create a sine wave. In max we have the `cycle~` object for generating sine wave signals. Objects with the `~` are denoted as **signal** objects which means it is an object that deals with audio.

If we create a single `cycle~` object and copy it, the resulting JSON looks like this:
```json
{
	"boxes" : [ 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "cycle~",
				"id" : "obj-5",
				"numinlets" : 2,
				"numoutlets" : 1,
				"patching_rect" : [ 402.666678667068481, 101.333336353302002, 43.0, 22.0 ],
				"outlettype" : [ "signal" ]
			}

		}
 ],
	"appversion" : 	{
		"major" : 8,
		"minor" : 6,
		"revision" : 2,
		"architecture" : "x64",
		"modernui" : 1
	}
,
	"classnamespace" : "box"
}
```

The `appversion` contains metadata about the system and version used. Its not important for our application so we can simply disregard it. Likewise `classnamespace` is not important to us right now. Instead, turn your attention to the data under `boxes`. Every `box` key value associated with the `boxes` field are the objects we have copied from our patch. Currently there is only one but we will soon see an example with more. A `box` represents any single object and contains attributes which will vary depending on the object. 

* **maxclass**: Most regular objects will be labeled as `newobj` but widget objects like buttons and dials will simply contain the name of the object in this field.*
* **text**: Whatever text is displayed within the objects starting with the objects name `cycle` in this case. If an argument or attribute is present after the object name they will be included here. For example, if the user specifies `440` as an argument for `cycle~` then the text field would read `cycle~ 440`.*
* **id**: Unique identifier for an object. Useful for differentiating between multiple objects with the same name.*
* **numinlets**: The number of inlets present on the object.*
* **numoutlets**: The number of inlets outlets on the object.*
* **patching_rect**: Determines the position of the object in the window.*
* **outlettype**: a list of the data type associated with each outlet. In this case there is only a single outlet of a `signal` type. If numoutlets is 0 then this field will not be present for that object. Regular data like integers, lists and symbols will be marked as `""` for generic max messages, `"signal"` for audio signals or `jit_matrix` for matrices as well as sometimes `"multichannelsignal"` for multichannel audio.*

### Simple Patch Connection in JSON

![!\[\[simple-connection.png\]\]](https://raw.githubusercontent.com/jacklion710/max-patch-visualizer/main/patch-visualizer-notes/simple-connection.png)

If we create a second object and make a single patch connection from one object to another, we can observe some changes in our JSON. The `dac~` object uses your computers digital audio converter if available to play audio aloud.

```json
{
	"boxes" : [ 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "dac~",
				"id" : "obj-2",
				"numinlets" : 2,
				"numoutlets" : 0,
				"patching_rect" : [ 308.666675865650177, 124.000003695487976, 35.0, 22.0 ]
			}

		}
, 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "cycle~ 440",
				"id" : "obj-1",
				"numinlets" : 2,
				"numoutlets" : 1,
				"patching_rect" : [ 308.666675865650177, 89.000002652406693, 66.0, 22.0 ],
				"outlettype" : [ "signal" ]
			}

		}
 ],
	"lines" : [ 		{
			"patchline" : 			{
				"source" : [ "obj-1", 0 ],
				"destination" : [ "obj-2", 0 ]
			}

		}
 ],
	"appversion" : 	{
		"major" : 8,
		"minor" : 6,
		"revision" : 2,
		"architecture" : "x64",
		"modernui" : 1
	}
,
	"classnamespace" : "box"
}
```

#### Multiple Boxes

In the patch above we can see there are now two fields called `box`. As described in the previous example, the properties within these fields tell us information about the object associated with that `box`. The only difference now is that we have multiple. There is theoretically no limit to the number of boxes you can spawn in a patch.

#### Patch Connections

Parallel to the `boxes` field are the `lines`. Lines refer to the patch cables that connect one object o another. Specifically what inlets. Many `patchline`s may be present but in our case we only have one for demonstration. Each `patchline` contains a `source` and `destination` attribute to demark the inlets and outlets that the `patchline` connects.

* **source**: A list with the first element being the `id` of the object where the patchline originates from and the second element being an index referring to the outlet where the connection propagates data from (left to right).
* **destination**: Similar to source except the destination is where the `patchline` connects to with the second element being an index representing the inlets from left to right. 

We'll discuss another example with multiple patchlines soon. But first we have a few more things to cover.

#### A Quick Note on Data Flow in Max

Any respectable max patch will consist of extensive patch connected. Essentially we are connecting nodes in a graph. The way data flows in max is fascinating as it pertains to path finding algorithms such as Depth First Search (DFS) and Breadth First Search (BFS). If you're interested in learning more about how the order of data flows between objects with patch cables this [video](https://www.youtube.com/watch?v=OnwmVuHxm30) can walk you through the flow. It is not necessary to follow along.

### Widget Objects

Max has a special category of objects for UI and interactivity. We usually just call them widgets. We have many different kinds at our disposal but some common ones include `slider`, `number`, `button` and `live.dial` all pictured below.

![!\[\[widgets.png\]\]](https://github.com/jacklion710/max-patch-visualizer/blob/main/patch-visualizer-notes/widgets.png)

These objects don't look that different from our usual JSON representation save for a few minor differences which we'll now go over.

```json
{
	"boxes" : [ 		{
			"box" : 			{
				"maxclass" : "slider",
				"id" : "obj-19",
				"parameter_enable" : 0,
				"numinlets" : 1,
				"numoutlets" : 1,
				"patching_rect" : [ 236.333340376615524, 60.500001445412636, 104.66666978597641, 34.333334356546402 ],
				"outlettype" : [ "" ]
			}

		}
, 		{
			"box" : 			{
				"maxclass" : "number",
				"id" : "obj-17",
				"parameter_enable" : 0,
				"numinlets" : 1,
				"numoutlets" : 2,
				"patching_rect" : [ 363.000010818243027, 66.666668623685837, 50.0, 22.0 ],
				"outlettype" : [ "", "bang" ]
			}

		}
, 		{
			"box" : 			{
				"maxclass" : "button",
				"id" : "obj-15",
				"parameter_enable" : 0,
				"numinlets" : 1,
				"numoutlets" : 1,
				"patching_rect" : [ 431.666679531335831, 65.666668623685837, 24.0, 24.0 ],
				"outlettype" : [ "bang" ]
			}

		}
, 		{
			"box" : 			{
				"maxclass" : "live.dial",
				"varname" : "live.dial",
				"id" : "obj-11",
				"parameter_enable" : 1,
				"numinlets" : 1,
				"numoutlets" : 2,
				"patching_rect" : [ 480.666680991649628, 48.329999999999984, 41.0, 48.0 ],
				"outlettype" : [ "", "float" ],
				"saved_attribute_attributes" : 				{
					"valueof" : 					{
						"parameter_longname" : "live.dial",
						"parameter_modmode" : 3,
						"parameter_shortname" : "live.dial",
						"parameter_type" : 0,
						"parameter_unitstyle" : 0
					}

				}

			}

		}
 ],
	"appversion" : 	{
		"major" : 8,
		"minor" : 6,
		"revision" : 2,
		"architecture" : "x64",
		"modernui" : 1
	}
,
	"classnamespace" : "box"
}

```

As you can see, the `maxclass` attribute now contains the actual name of the widget object instance. Although we can still see the name in the `text` field, by evaluating whether the value for `maxclass` is  `newobj` or something else, we can determine whether we are dealing with a generic object or a widget object. Additionally, objects whose methods and objects fall under the `live` class have additional properties under `saved_attribute_attributes` which we can ignore for this project.

### Complex Patches

Now we are ready to see a patch we might be more likely to encounter in the wild. Although not as extensive as most devices in production, it is a snippet that represents a realistic scenario with multiple objects and patch connections.

![!\[\[widget+complex patch.png\]\]](https://raw.githubusercontent.com/jacklion710/max-patch-visualizer/main/patch-visualizer-notes/widget%2Bcomplex%20patch.png)

In the image above we connect the outlet of `live.dial` (which sends lets users select a number to output with a dial) to the left inlet of a `+` object with an argument of **50** and the left inlet of a `cycle~` object as well. The outlet of `+` connects to the left inlet of a second `cycle~` object. Both `cycle~` objects finally connect to each the left and right inlets of `~dac` respectively. It's just a shoddy pitchable oscillator where the right speaker always plays a sine wave 50 hz above the left as determined by the dials value. Its not a very realistic patch in a sound designer sense but is valid and realistic enough that it will help us gain insight into the JSON structure of a patch that features multiple objects and connections.

```json
{
	"boxes" : [ 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "+ 50",
				"id" : "obj-22",
				"numinlets" : 2,
				"numoutlets" : 1,
				"patching_rect" : [ 358.333344012498856, 128.333337157964706, 32.0, 22.0 ],
				"outlettype" : [ "int" ]
			}

		}
, 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "cycle~",
				"id" : "obj-21",
				"numinlets" : 2,
				"numoutlets" : 1,
				"patching_rect" : [ 358.333344012498856, 158.666671395301819, 43.0, 22.0 ],
				"outlettype" : [ "signal" ]
			}

		}
, 		{
			"box" : 			{
				"maxclass" : "live.dial",
				"varname" : "live.dial",
				"id" : "obj-11",
				"parameter_enable" : 1,
				"numinlets" : 1,
				"numoutlets" : 2,
				"patching_rect" : [ 277.000008255243301, 51.000001519918442, 41.0, 48.0 ],
				"outlettype" : [ "", "float" ],
				"saved_attribute_attributes" : 				{
					"valueof" : 					{
						"parameter_longname" : "live.dial",
						"parameter_modmode" : 3,
						"parameter_shortname" : "live.dial",
						"parameter_type" : 0,
						"parameter_unitstyle" : 0
					}

				}

			}

		}
, 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "dac~",
				"id" : "obj-2",
				"numinlets" : 2,
				"numoutlets" : 0,
				"patching_rect" : [ 277.000008255243301, 209.666672915220261, 35.0, 22.0 ]
			}

		}
, 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "cycle~",
				"id" : "obj-1",
				"numinlets" : 2,
				"numoutlets" : 1,
				"patching_rect" : [ 277.000008255243301, 158.666671395301819, 43.0, 22.0 ],
				"outlettype" : [ "signal" ]
			}

		}
 ],
	"lines" : [ 		{
			"patchline" : 			{
				"source" : [ "obj-21", 0 ],
				"destination" : [ "obj-2", 1 ]
			}

		}
, 		{
			"patchline" : 			{
				"source" : [ "obj-22", 0 ],
				"destination" : [ "obj-21", 0 ]
			}

		}
, 		{
			"patchline" : 			{
				"source" : [ "obj-11", 0 ],
				"destination" : [ "obj-22", 0 ],
				"order" : 0
			}

		}
, 		{
			"patchline" : 			{
				"source" : [ "obj-1", 0 ],
				"destination" : [ "obj-2", 0 ]
			}

		}
, 		{
			"patchline" : 			{
				"source" : [ "obj-11", 0 ],
				"destination" : [ "obj-1", 0 ],
				"order" : 1
			}

		}
 ],
	"appversion" : 	{
		"major" : 8,
		"minor" : 6,
		"revision" : 2,
		"architecture" : "x64",
		"modernui" : 1
	}
,
	"classnamespace" : "box"
}
```

Theres not much we haven't already discussed going on in the JSON structure above. Biggest difference being the fact that now there are a handful of additional objects and patchlines. If you look closely at the patchlines and follow along with the id values and visually inspect the screenshot you can see that it tracks. Notice the `order` attribute though? This informs us of what order we will be sending out data from two patch cables that spawn from the same source. This is another attribute that we will not be using for our use case but can come in handy for debugging as often it is tricky to determine the order of operations in Max. A good rule of thumb is that messages flow in order from rightmost outlets to left. *See linked resource from earlier on data flow for more info*.
### Nested Subpatchers

Sometimes we will encounter nested structures in a max patch. The most basic kind is the `subpatcher` aka `p`, an object which encapsulates portions of a patch. There are other similar ones, the closest relative being `bpatcher`, a subpatcher which a see through window for encapsulating UI components as opposed to raw objects. There are also `poly~` ,`fft~`, `~rnbo` and more but these complicate things so for now we don't care about them. 

![!\[\[subpatcher.png\]\]](https://raw.githubusercontent.com/jacklion710/max-patch-visualizer/main/patch-visualizer-notes/subpatcher.png)

In this example, we have a simple subpatcher `p` called *subpatcher* which contains a single `cycle~` object inside. Below we can see the `patcher` field which contains more information about the patch including its enclosed JSON subpatch objects and their connections. Since we're only rendering the `p` object and its text we don't care about the contents of `patcher` for now although it is important to still note the `numinlet` and `numoutlet` attributes as subpatchers can have a varied number of inlets and outlets depending on the users design. There are generally a few objects whose behavior and 'shapes' are versatile.

### Subpatchers Within Subpatchers

Subpatchers may be many layers deep. Just for a crazy example I provided here the JSON for a subpatcher with several layers of subpatcher nesting. See if you can spot the innermost object and its text!

```json
{
	"boxes" : [ 		{
			"box" : 			{
				"maxclass" : "newobj",
				"text" : "p subpatcher",
				"id" : "obj-26",
				"numinlets" : 0,
				"numoutlets" : 0,
				"patching_rect" : [ 498.000014841556549, 143.333337604999542, 78.0, 22.0 ],
				"patcher" : 				{
					"fileversion" : 1,
					"appversion" : 					{
						"major" : 8,
						"minor" : 6,
						"revision" : 2,
						"architecture" : "x64",
						"modernui" : 1
					}
,
					"classnamespace" : "box",
					"rect" : [ 59.0, 81.0, 640.0, 480.0 ],
					"bglocked" : 0,
					"openinpresentation" : 0,
					"default_fontsize" : 12.0,
					"default_fontface" : 0,
					"default_fontname" : "Arial",
					"gridonopen" : 1,
					"gridsize" : [ 15.0, 15.0 ],
					"gridsnaponopen" : 1,
					"objectsnaponopen" : 1,
					"statusbarvisible" : 2,
					"toolbarvisible" : 1,
					"lefttoolbarpinned" : 0,
					"toptoolbarpinned" : 0,
					"righttoolbarpinned" : 0,
					"bottomtoolbarpinned" : 0,
					"toolbars_unpinned_last_save" : 0,
					"tallnewobj" : 0,
					"boxanimatetime" : 200,
					"enablehscroll" : 1,
					"enablevscroll" : 1,
					"devicewidth" : 0.0,
					"description" : "",
					"digest" : "",
					"tags" : "",
					"style" : "",
					"subpatcher_template" : "",
					"assistshowspatchername" : 0,
					"boxes" : [ 						{
							"box" : 							{
								"maxclass" : "newobj",
								"text" : "p inner-subpatcher",
								"id" : "obj-4",
								"numinlets" : 0,
								"numoutlets" : 0,
								"patching_rect" : [ 141.0, 237.0, 109.0, 22.0 ],
								"patcher" : 								{
									"fileversion" : 1,
									"appversion" : 									{
										"major" : 8,
										"minor" : 6,
										"revision" : 2,
										"architecture" : "x64",
										"modernui" : 1
									}
,
									"classnamespace" : "box",
									"rect" : [ 84.0, 106.0, 640.0, 480.0 ],
									"bglocked" : 0,
									"openinpresentation" : 0,
									"default_fontsize" : 12.0,
									"default_fontface" : 0,
									"default_fontname" : "Arial",
									"gridonopen" : 1,
									"gridsize" : [ 15.0, 15.0 ],
									"gridsnaponopen" : 1,
									"objectsnaponopen" : 1,
									"statusbarvisible" : 2,
									"toolbarvisible" : 1,
									"lefttoolbarpinned" : 0,
									"toptoolbarpinned" : 0,
									"righttoolbarpinned" : 0,
									"bottomtoolbarpinned" : 0,
									"toolbars_unpinned_last_save" : 0,
									"tallnewobj" : 0,
									"boxanimatetime" : 200,
									"enablehscroll" : 1,
									"enablevscroll" : 1,
									"devicewidth" : 0.0,
									"description" : "",
									"digest" : "",
									"tags" : "",
									"style" : "",
									"subpatcher_template" : "",
									"assistshowspatchername" : 0,
									"visible" : 1,
									"boxes" : [ 										{
											"box" : 											{
												"maxclass" : "newobj",
												"text" : "p inner-subpatcher-deep",
												"id" : "obj-1",
												"numinlets" : 0,
												"numoutlets" : 0,
												"patching_rect" : [ 169.0, 203.0, 139.0, 22.0 ],
												"patcher" : 												{
													"fileversion" : 1,
													"appversion" : 													{
														"major" : 8,
														"minor" : 6,
														"revision" : 2,
														"architecture" : "x64",
														"modernui" : 1
													}
,
													"classnamespace" : "box",
													"rect" : [ 109.0, 131.0, 640.0, 480.0 ],
													"bglocked" : 0,
													"openinpresentation" : 0,
													"default_fontsize" : 12.0,
													"default_fontface" : 0,
													"default_fontname" : "Arial",
													"gridonopen" : 1,
													"gridsize" : [ 15.0, 15.0 ],
													"gridsnaponopen" : 1,
													"objectsnaponopen" : 1,
													"statusbarvisible" : 2,
													"toolbarvisible" : 1,
													"lefttoolbarpinned" : 0,
													"toptoolbarpinned" : 0,
													"righttoolbarpinned" : 0,
													"bottomtoolbarpinned" : 0,
													"toolbars_unpinned_last_save" : 0,
													"tallnewobj" : 0,
													"boxanimatetime" : 200,
													"enablehscroll" : 1,
													"enablevscroll" : 1,
													"devicewidth" : 0.0,
													"description" : "",
													"digest" : "",
													"tags" : "",
													"style" : "",
													"subpatcher_template" : "",
													"assistshowspatchername" : 0,
													"visible" : 1,
													"boxes" : [ 														{
															"box" : 															{
																"maxclass" : "comment",
																"text" : "I am a helpful comment",
																"id" : "obj-2",
																"numinlets" : 1,
																"numoutlets" : 0,
																"patching_rect" : [ 320.0, 194.0, 150.0, 20.0 ]
															}

														}
 ],
													"lines" : [  ]
												}
,
												"saved_object_attributes" : 												{
													"description" : "",
													"digest" : "",
													"globalpatchername" : "",
													"tags" : ""
												}

											}

										}
 ],
									"lines" : [  ]
								}
,
								"saved_object_attributes" : 								{
									"description" : "",
									"digest" : "",
									"globalpatchername" : "",
									"tags" : ""
								}

							}

						}
 ],
					"lines" : [  ]
				}
,
				"saved_object_attributes" : 				{
					"description" : "",
					"digest" : "",
					"globalpatchername" : "",
					"tags" : ""
				}

			}

		}
 ],
	"appversion" : 	{
		"major" : 8,
		"minor" : 6,
		"revision" : 2,
		"architecture" : "x64",
		"modernui" : 1
	}
,
	"classnamespace" : "box"
}
```
## Implementation

Now, let's outline the general approach for programming the web visualizer:

1. Parsing the JSON:
    - Create a function to parse the JSON structure of a Max patch.
    - Extract relevant information such as objects, their positions, connections, inlets, outlets, and any necessary attributes.
    - Handle special cases like subpatchers and nested structures recursively.
    - Ignore irrelevant fields like "appversion" and "classnamespace" for the purpose of visualization.
2. Object Representation:
    - Define a data structure or class to represent each Max object.
    - Store the object's type, position, inlets, outlets, and any other relevant attributes.
    - Create functions to instantiate objects based on the parsed JSON data.
3. Connection Representation:
    - Define a data structure or class to represent connections between objects.
    - Store the source object, source outlet, destination object, and destination inlet for each connection.
    - Create functions to establish connections based on the parsed JSON data.
4. Visualization:
    - Choose a suitable web technology for rendering the visualization (e.g., HTML5 Canvas, SVG, or a library like D3.js).
    - Create functions to render objects based on their positions and attributes.
    - Implement rendering of connections between objects.
    - Handle special cases like subpatchers, potentially using nested or hierarchical representations. Maybe spawn additional canvases for each layer.
    - Special representations for widgets or custom widget icons to mimic their look. Otherwise simple box objects with the widgets name will suffice to start
1. Interaction and Navigation:
    - Implement zooming and panning functionality to navigate large patches.
    - Consider adding tooltips or hover effects to display object details.
    - Implement search or filtering mechanisms to locate specific objects or connections.
2. Testing and Error Handling:
    - Create test cases with various patch structures to ensure accurate parsing and visualization.
    - Handle potential errors gracefully, such as missing or malformed JSON data.
    - Implement error logging and user-friendly error messages for debugging purposes.