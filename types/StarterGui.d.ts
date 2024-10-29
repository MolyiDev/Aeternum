interface StarterGui extends BasePlayerGui {
	ScreenGUI_Settings: ScreenGui & {
		SettingsGUI: CanvasGroup & {
			Settings: CanvasGroup & {
				Visual: CanvasGroup & {
					Shadows: Frame & {
						UICorner: UICorner;
						Text: CanvasGroup & {
							Title: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
							Explanation: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
						};
						UIGradient: UIGradient;
						Toggle: ImageButton & {
							KnobOn: Frame & {
								UICorner: UICorner;
							};
							UICorner: UICorner;
							Knob: Frame & {
								UICorner: UICorner;
							};
							KnobOff: Frame & {
								UICorner: UICorner;
							};
						};
					};
					UIPadding: UIPadding;
					SettingsVisualScript: LocalScript;
					DepthOfField: Frame & {
						UICorner: UICorner;
						Text: CanvasGroup & {
							Title: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
							Explanation: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
						};
						UIGradient: UIGradient;
						Toggle: ImageButton & {
							KnobOn: Frame & {
								UICorner: UICorner;
							};
							UICorner: UICorner;
							Knob: Frame & {
								UICorner: UICorner;
							};
							KnobOff: Frame & {
								UICorner: UICorner;
							};
						};
					};
					Bloom: Frame & {
						UICorner: UICorner;
						Text: CanvasGroup & {
							Title: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
							Explanation: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
						};
						UIGradient: UIGradient;
						Toggle: ImageButton & {
							KnobOn: Frame & {
								UICorner: UICorner;
							};
							UICorner: UICorner;
							Knob: Frame & {
								UICorner: UICorner;
							};
							KnobOff: Frame & {
								UICorner: UICorner;
							};
						};
					};
					UIListLayout: UIListLayout;
				};
				Controls: CanvasGroup & {
					ScrollControls: ScrollingFrame & {
						UIListLayout: UIListLayout;
						Forward: Frame & {
							Principal: ImageButton & {
								UICorner: UICorner;
								TextKey: TextLabel & {
									UIStroke: UIStroke;
								};
								Stroke: UIStroke;
							};
							Alternative: ImageButton & {
								UICorner: UICorner;
								TextKey: TextLabel & {
									UIStroke: UIStroke;
								};
								Stroke: UIStroke;
							};
							UICorner: UICorner;
							Text: CanvasGroup & {
								Title: Frame & {
									TextShadow: TextLabel;
									Text: TextLabel;
								};
								Explanation: Frame & {
									TextShadow: TextLabel;
									Text: TextLabel;
								};
							};
							UIGradient: UIGradient;
						};
						UIPadding: UIPadding;
					};
					SettingsControlsScript: LocalScript;
					AdviceGroup: CanvasGroup & {
						Button: ImageButton & {
							UICorner: UICorner;
							Text: TextLabel;
							UIGradient: UIGradient;
						};
					};
				};
				Audio: CanvasGroup & {
					UIPadding: UIPadding;
					SettingsAudioScript: LocalScript;
					UIListLayout: UIListLayout;
					Music: Frame & {
						UICorner: UICorner;
						Text: CanvasGroup & {
							Title: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
							Explanation: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
						};
						UIGradient: UIGradient;
						Drag: CanvasGroup & {
							OutsideBar: Frame & {
								InsideBar: Frame & {
									Handle: Frame & {
										UICorner: UICorner;
										UIStroke: UIStroke;
										DragDetector: UIDragDetector;
									};
									DragDetector: UIDragDetector;
									UICorner: UICorner;
								};
								FrameBar: Frame;
								UICorner: UICorner;
							};
							VolumeBox: Frame & {
								UICorner: UICorner;
								Volume: TextBox & {
									UIStroke: UIStroke;
								};
							};
						};
					};
					Overall: Frame & {
						UICorner: UICorner;
						Text: CanvasGroup & {
							Title: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
							Explanation: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
						};
						UIGradient: UIGradient;
						Drag: CanvasGroup & {
							OutsideBar: Frame & {
								InsideBar: Frame & {
									Handle: Frame & {
										UICorner: UICorner;
										UIStroke: UIStroke;
										DragDetector: UIDragDetector;
									};
									DragDetector: UIDragDetector;
									UICorner: UICorner;
								};
								FrameBar: Frame;
								UICorner: UICorner;
							};
							VolumeBox: Frame & {
								UICorner: UICorner;
								Volume: TextBox & {
									UIStroke: UIStroke;
								};
							};
						};
					};
					Effects: Frame & {
						UICorner: UICorner;
						Text: CanvasGroup & {
							Title: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
							Explanation: Frame & {
								TextShadow: TextLabel;
								Text: TextLabel;
							};
						};
						UIGradient: UIGradient;
						Drag: CanvasGroup & {
							OutsideBar: Frame & {
								InsideBar: Frame & {
									Handle: Frame & {
										UICorner: UICorner;
										UIStroke: UIStroke;
										DragDetector: UIDragDetector;
									};
									DragDetector: UIDragDetector;
									UICorner: UICorner;
								};
								FrameBar: Frame;
								UICorner: UICorner;
							};
							VolumeBox: Frame & {
								UICorner: UICorner;
								Volume: TextBox & {
									UIStroke: UIStroke;
								};
							};
						};
					};
				};
				ButtonClose: Frame & {
					FrameGlow: Frame & {
						UICorner: UICorner;
					};
					ButtonClose: ImageButton & {
						ButtonScript: LocalScript;
						UICorner: UICorner;
						UIStroke: UIStroke;
						Frame: CanvasGroup & {
							UICorner: UICorner;
							Shine: ImageLabel;
						};
						Text: TextLabel;
					};
				};
			};
			Reset: CanvasGroup & {
				Question: Frame & {
					UICorner: UICorner;
					UIGradient: UIGradient;
					TextLabel: TextLabel;
				};
				Background: Frame & {
					UIGradient: UIGradient;
				};
			};
			ScriptSettings: LocalScript;
			Background: Frame & {
				UIGradient: UIGradient;
			};
			Fades: CanvasGroup & {
				TopFade: Frame & {
					UIGradient: UIGradient;
				};
			};
			UpBar: CanvasGroup & {
				Line: Frame & {
					Controls: ImageLabel;
					UIGridLayout: UIGridLayout;
					Audio: ImageLabel;
					UIGradient: UIGradient;
					Visual: ImageLabel;
					General: ImageLabel;
					Crosshair: ImageLabel;
				};
				Order: Frame & {
					Visual: CanvasGroup & {
						Button: ImageButton;
						Shadow: ImageLabel;
					};
					UIGridLayout: UIGridLayout & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					General: CanvasGroup & {
						Button: ImageButton;
						Shadow: ImageLabel;
					};
					Audio: CanvasGroup & {
						Button: ImageButton;
						Shadow: ImageLabel;
					};
					Controls: CanvasGroup & {
						Button: ImageButton;
						Shadow: ImageLabel;
					};
					Crosshair: CanvasGroup & {
						Button: ImageButton;
						Shadow: ImageLabel;
					};
				};
				ResetGroup: CanvasGroup;
				TextGroup: CanvasGroup & {
					TextSetting: TextLabel;
					TextSettingShadow: TextLabel;
				};
				Reset: ImageButton;
			};
		};
	};
	ScreenGUI_Ship: ScreenGui & {
		ShipGroup: CanvasGroup & {
			UIGradient: UIGradient;
			GeneralHealthGroup: CanvasGroup & {
				GeneralHealthImage: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				GeneralHealthBar: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
				GeneralHealthBarBack: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
			};
			EnergyGroup: CanvasGroup & {
				EnergyImage: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				EnergyBarBack: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
				EnergyBar: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
			};
			ShieldGroup: CanvasGroup & {
				ShieldBar: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
				ShieldBarBack: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
				ShieldImage: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			BodyHealthGroup: CanvasGroup & {
				BodyHealthImage: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				BodyHealthBarBack: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
				BodyHealthBar: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
			};
			VelocityGroup: CanvasGroup & {
				VelocityBar: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
				VelocityBarBack: CanvasGroup & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
					["8"]: Frame & {
						UICorner: UICorner;
					};
					["4"]: Frame & {
						UICorner: UICorner;
					};
					["5"]: Frame & {
						UICorner: UICorner;
					};
					["13"]: Frame & {
						UICorner: UICorner;
					};
					["1"]: Frame & {
						UICorner: UICorner;
					};
					["9"]: Frame & {
						UICorner: UICorner;
					};
					["3"]: Frame & {
						UICorner: UICorner;
					};
					["2"]: Frame & {
						UICorner: UICorner;
					};
					["19"]: Frame & {
						UICorner: UICorner;
					};
					["18"]: Frame & {
						UICorner: UICorner;
					};
					["7"]: Frame & {
						UICorner: UICorner;
					};
					["6"]: Frame & {
						UICorner: UICorner;
					};
					["14"]: Frame & {
						UICorner: UICorner;
					};
					["15"]: Frame & {
						UICorner: UICorner;
					};
					["16"]: Frame & {
						UICorner: UICorner;
					};
					["17"]: Frame & {
						UICorner: UICorner;
					};
					["20"]: Frame & {
						UICorner: UICorner;
					};
					["12"]: Frame & {
						UICorner: UICorner;
					};
					["11"]: Frame & {
						UICorner: UICorner;
					};
					["10"]: Frame & {
						UICorner: UICorner;
					};
				};
				TextVelocity: TextLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			Abilities: CanvasGroup & {
				Ability1: CanvasGroup & {
					Ability: CanvasGroup & {
						Image: ImageLabel & {
							UIGradient: UIGradient;
						};
						BackgroundImage: Frame & {
							UICorner: UICorner;
							UIStroke: UIStroke;
						};
						Background: Frame & {
							UICorner: UICorner;
							UIStroke: UIStroke;
						};
					};
					Cooldown: CanvasGroup & {
						UICorner: UICorner;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				UIGridLayout: UIGridLayout;
			};
		};
	};
	ScreenGUI_Start: ScreenGui & {
		StartGUI: CanvasGroup & {
			CoinsGroup: CanvasGroup & {
				Scrap: CanvasGroup & {
					Shadow: TextLabel;
					Image: ImageLabel;
					ImageShadow: ImageLabel;
					Text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				DarkMatter: CanvasGroup & {
					Shadow: TextLabel;
					Image: ImageLabel;
					ImageShadow: ImageLabel;
					Text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
			};
			SettingsGroup: CanvasGroup & {
				Button: ImageButton & {
					TextGroup: CanvasGroup & {
						UICorner: UICorner;
						TextSettings: TextLabel;
					};
				};
				Shadow: ImageLabel;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				ButtonScript: LocalScript;
			};
			CenterGroup: CanvasGroup & {
				ButtonPlay: ImageButton & {
					Text: TextLabel & {
						UIStroke: UIStroke;
						UIPadding: UIPadding;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					Shadow: TextLabel & {
						UIPadding: UIPadding;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					Inside: ImageLabel & {
						UIGradient: UIGradient;
					};
				};
				Background: ImageLabel & {
					StoreGroup: CanvasGroup & {
						Button: ImageButton & {
							TextGroup: CanvasGroup & {
								Frame: Frame & {
									UICorner: UICorner;
									UIStroke: UIStroke & {
										UIGradient: UIGradient;
									};
									Text: TextLabel;
								};
							};
						};
						Shadow: ImageLabel;
					};
					HangarGroup: CanvasGroup & {
						Button: ImageButton & {
							TextGroup: CanvasGroup & {
								Frame: Frame & {
									UICorner: UICorner;
									Text: TextLabel;
									UIStroke: UIStroke & {
										UIGradient: UIGradient;
									};
								};
							};
						};
						Shadow: ImageLabel;
					};
					MissionsGroup: CanvasGroup & {
						Button: ImageButton & {
							TextGroup: CanvasGroup & {
								Frame: Frame & {
									UICorner: UICorner;
									UIStroke: UIStroke & {
										UIGradient: UIGradient;
									};
									Text: TextLabel;
								};
							};
						};
						Shadow: ImageLabel;
					};
					StatisticsGroup: CanvasGroup & {
						Button: ImageButton & {
							TextGroup: CanvasGroup & {
								Frame: Frame & {
									UICorner: UICorner;
									UIStroke: UIStroke & {
										UIGradient: UIGradient;
									};
									Text: TextLabel;
								};
							};
						};
						Shadow: ImageLabel;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIGradient: UIGradient;
				};
			};
		};
	};
}
