interface Workspace extends Model {
	Characters: Folder & {
		NPC: Folder & {
			Attacking: Model & {
				LeftLowerArm: MeshPart & {
					LeftLowerArm: WrapTarget;
					OriginalSize: Vector3Value;
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbow: Motor6D;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftFoot: WrapTarget;
					LeftAnkle: Motor6D;
					OriginalSize: Vector3Value;
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightFootBox: Accessory & {
					Handle: Part & {
						RightFootAttachment: Attachment;
						OriginalSize: Vector3Value;
						AccessoryWeld: Weld;
					};
				};
				RightHand: MeshPart & {
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWrist: Motor6D;
					OriginalSize: Vector3Value;
					RightHand: WrapTarget;
				};
				HumanoidRootPart: Part & {
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFootBox: Accessory & {
					Handle: Part & {
						AccessoryWeld: Weld;
						OriginalSize: Vector3Value;
						LeftFootAttachment: Attachment;
					};
				};
				RightLowerLeg: MeshPart & {
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKnee: Motor6D;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLeg: WrapTarget;
					OriginalSize: Vector3Value;
				};
				LeftUpperLeg: MeshPart & {
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHip: Motor6D;
					OriginalSize: Vector3Value;
					LeftUpperLeg: WrapTarget;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftLowerLeg: MeshPart & {
					LeftKnee: Motor6D;
					OriginalSize: Vector3Value;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLeg: WrapTarget;
				};
				LowerTorso: MeshPart & {
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Root: Motor6D;
					OriginalSize: Vector3Value;
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LowerTorso: WrapTarget;
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Head: MeshPart & {
					Neck: Motor6D;
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					Head: WrapTarget;
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Abilities: Folder;
				UpperTorso: MeshPart & {
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					UpperTorso: WrapTarget;
					OriginalSize: Vector3Value;
					Waist: Motor6D;
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				["Body Colors"]: BodyColors;
				HeadPart: Part & {
					OriginalSize: Vector3Value;
					WeldConstraint: WeldConstraint;
				};
				LeftUpperArm: MeshPart & {
					LeftUpperArm: WrapTarget;
					LeftShoulder: Motor6D;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightLowerArm: MeshPart & {
					RightLowerArm: WrapTarget;
					OriginalSize: Vector3Value;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightElbow: Motor6D;
				};
				LeftHand: MeshPart & {
					LeftHand: WrapTarget;
					LeftWrist: Motor6D;
					LeftGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Highlight: Highlight;
				Humanoid: Humanoid & {
					BodyDepthScale: NumberValue;
					BodyHeightScale: NumberValue;
					BodyTypeScale: NumberValue;
					Status: Status;
					Halo: Model & {
						HaloSides: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
						HaloPrincipal: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
						HaloCenter: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
					};
					BodyProportionScale: NumberValue;
					Animator: Animator;
					BodyWidthScale: NumberValue;
					HumanoidDescription: HumanoidDescription;
					HeadScale: NumberValue;
				};
				RightUpperArm: MeshPart & {
					RightUpperArm: WrapTarget;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulder: Motor6D;
				};
				RightUpperLeg: MeshPart & {
					RightHip: Motor6D;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLeg: WrapTarget;
					OriginalSize: Vector3Value;
				};
				RightFoot: MeshPart & {
					RightFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightAnkle: Motor6D;
					OriginalSize: Vector3Value;
					RightFoot: WrapTarget;
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
			};
			Standing: Model & {
				LeftLowerArm: MeshPart & {
					LeftLowerArm: WrapTarget;
					OriginalSize: Vector3Value;
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbow: Motor6D;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftFoot: WrapTarget;
					LeftAnkle: Motor6D;
					OriginalSize: Vector3Value;
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightFootBox: Accessory & {
					Handle: Part & {
						RightFootAttachment: Attachment;
						OriginalSize: Vector3Value;
						AccessoryWeld: Weld;
					};
				};
				RightHand: MeshPart & {
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWrist: Motor6D;
					OriginalSize: Vector3Value;
					RightHand: WrapTarget;
				};
				HumanoidRootPart: Part & {
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFootBox: Accessory & {
					Handle: Part & {
						AccessoryWeld: Weld;
						OriginalSize: Vector3Value;
						LeftFootAttachment: Attachment;
					};
				};
				RightLowerLeg: MeshPart & {
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKnee: Motor6D;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLeg: WrapTarget;
					OriginalSize: Vector3Value;
				};
				LeftUpperLeg: MeshPart & {
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHip: Motor6D;
					OriginalSize: Vector3Value;
					LeftUpperLeg: WrapTarget;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftLowerLeg: MeshPart & {
					LeftKnee: Motor6D;
					OriginalSize: Vector3Value;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLeg: WrapTarget;
				};
				LowerTorso: MeshPart & {
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Root: Motor6D;
					OriginalSize: Vector3Value;
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LowerTorso: WrapTarget;
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Head: MeshPart & {
					Neck: Motor6D;
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					Head: WrapTarget;
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Abilities: Folder;
				UpperTorso: MeshPart & {
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					UpperTorso: WrapTarget;
					OriginalSize: Vector3Value;
					Waist: Motor6D;
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				["Body Colors"]: BodyColors;
				HeadPart: Part & {
					OriginalSize: Vector3Value;
					WeldConstraint: WeldConstraint;
				};
				LeftUpperArm: MeshPart & {
					LeftUpperArm: WrapTarget;
					LeftShoulder: Motor6D;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightLowerArm: MeshPart & {
					RightLowerArm: WrapTarget;
					OriginalSize: Vector3Value;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightElbow: Motor6D;
				};
				LeftHand: MeshPart & {
					LeftHand: WrapTarget;
					LeftWrist: Motor6D;
					LeftGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Highlight: Highlight;
				Humanoid: Humanoid & {
					BodyDepthScale: NumberValue;
					BodyHeightScale: NumberValue;
					BodyTypeScale: NumberValue;
					Status: Status;
					Halo: Model & {
						HaloSides: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
						HaloPrincipal: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
						HaloCenter: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
					};
					BodyProportionScale: NumberValue;
					Animator: Animator;
					BodyWidthScale: NumberValue;
					HumanoidDescription: HumanoidDescription;
					HeadScale: NumberValue;
				};
				RightUpperArm: MeshPart & {
					RightUpperArm: WrapTarget;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulder: Motor6D;
				};
				RightUpperLeg: MeshPart & {
					RightHip: Motor6D;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLeg: WrapTarget;
					OriginalSize: Vector3Value;
				};
				RightFoot: MeshPart & {
					RightFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightAnkle: Motor6D;
					OriginalSize: Vector3Value;
					RightFoot: WrapTarget;
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
			};
			Blocking: Model & {
				LeftLowerArm: MeshPart & {
					LeftLowerArm: WrapTarget;
					OriginalSize: Vector3Value;
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbow: Motor6D;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftFoot: WrapTarget;
					LeftAnkle: Motor6D;
					OriginalSize: Vector3Value;
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightFootBox: Accessory & {
					Handle: Part & {
						RightFootAttachment: Attachment;
						OriginalSize: Vector3Value;
						AccessoryWeld: Weld;
					};
				};
				RightHand: MeshPart & {
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWrist: Motor6D;
					OriginalSize: Vector3Value;
					RightHand: WrapTarget;
				};
				HumanoidRootPart: Part & {
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFootBox: Accessory & {
					Handle: Part & {
						AccessoryWeld: Weld;
						OriginalSize: Vector3Value;
						LeftFootAttachment: Attachment;
					};
				};
				RightLowerLeg: MeshPart & {
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKnee: Motor6D;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLeg: WrapTarget;
					OriginalSize: Vector3Value;
				};
				LeftUpperLeg: MeshPart & {
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHip: Motor6D;
					OriginalSize: Vector3Value;
					LeftUpperLeg: WrapTarget;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftLowerLeg: MeshPart & {
					LeftKnee: Motor6D;
					OriginalSize: Vector3Value;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLeg: WrapTarget;
				};
				LowerTorso: MeshPart & {
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Root: Motor6D;
					OriginalSize: Vector3Value;
					RootRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LowerTorso: WrapTarget;
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Head: MeshPart & {
					Neck: Motor6D;
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					Head: WrapTarget;
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Abilities: Folder;
				UpperTorso: MeshPart & {
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					UpperTorso: WrapTarget;
					OriginalSize: Vector3Value;
					Waist: Motor6D;
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				["Body Colors"]: BodyColors;
				HeadPart: Part & {
					OriginalSize: Vector3Value;
					WeldConstraint: WeldConstraint;
				};
				LeftUpperArm: MeshPart & {
					LeftUpperArm: WrapTarget;
					LeftShoulder: Motor6D;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightLowerArm: MeshPart & {
					RightLowerArm: WrapTarget;
					OriginalSize: Vector3Value;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightElbow: Motor6D;
				};
				LeftHand: MeshPart & {
					LeftHand: WrapTarget;
					LeftWrist: Motor6D;
					LeftGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				Highlight: Highlight;
				Humanoid: Humanoid & {
					BodyDepthScale: NumberValue;
					BodyHeightScale: NumberValue;
					BodyTypeScale: NumberValue;
					Status: Status;
					Halo: Model & {
						HaloSides: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
						HaloPrincipal: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
						HaloCenter: MeshPart & {
							WeldConstraint: WeldConstraint;
						};
					};
					BodyProportionScale: NumberValue;
					Animator: Animator;
					BodyWidthScale: NumberValue;
					HumanoidDescription: HumanoidDescription;
					HeadScale: NumberValue;
				};
				RightUpperArm: MeshPart & {
					RightUpperArm: WrapTarget;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightShoulderRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulder: Motor6D;
				};
				RightUpperLeg: MeshPart & {
					RightHip: Motor6D;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLeg: WrapTarget;
					OriginalSize: Vector3Value;
				};
				RightFoot: MeshPart & {
					RightFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightAnkle: Motor6D;
					OriginalSize: Vector3Value;
					RightFoot: WrapTarget;
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
			};
		};
	};
	Tree: Model & {
		LeavesParticle: Part & {
			ParticleEmitter: ParticleEmitter;
		};
		Bark: MeshPart;
		Leaves: Model;
	};
	ElGoat: Model & {
		LeftLowerArm: MeshPart & {
			LeftElbowRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftElbow: Motor6D;
			OriginalSize: Vector3Value;
			LeftWristRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		LeftFoot: MeshPart & {
			OriginalSize: Vector3Value;
			LeftAnkleRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftAnkle: Motor6D;
		};
		AnimSaves: ObjectValue;
		RightHand: MeshPart & {
			OriginalSize: Vector3Value;
			RightWristRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightWrist: Motor6D;
			Handle: Motor6D;
			RightGripAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		HumanoidRootPart: Part & {
			RootRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
		};
		Shirt: Shirt;
		Pants: Pants;
		RightLowerLeg: MeshPart & {
			RightKneeRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightAnkleRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightKnee: Motor6D;
			OriginalSize: Vector3Value;
		};
		LeftUpperLeg: MeshPart & {
			OriginalSize: Vector3Value;
			LeftHip: Motor6D;
			LeftHipRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftKneeRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		LeftLowerLeg: MeshPart & {
			OriginalSize: Vector3Value;
			LeftKnee: Motor6D;
			LeftAnkleRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftKneeRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		RightUpperArm: MeshPart & {
			OriginalSize: Vector3Value;
			RightElbowRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightShoulderRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightShoulderAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightShoulder: Motor6D;
		};
		Head: Part & {
			HatAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			NeckRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			FaceFrontAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			face: Decal;
			HairAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			Neck: Motor6D;
			Mesh: SpecialMesh & {
				OriginalSize: Vector3Value;
			};
			FaceCenterAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		UpperTorso: MeshPart & {
			RightCollarAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			BodyBackAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			NeckRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftCollarAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			Waist: Motor6D;
			RightShoulderRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			BodyFrontAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			WaistRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftShoulderRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			NeckAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		LeftUpperArm: MeshPart & {
			LeftShoulderRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftShoulder: Motor6D;
			LeftShoulderAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftElbowRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
		};
		RightLowerArm: MeshPart & {
			RightWristRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			RightElbow: Motor6D;
			RightElbowRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		LeftHand: MeshPart & {
			LeftWrist: Motor6D;
			LeftGripAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			LeftWristRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		Sword: Model & {
			Decory_Blade_Part: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
			Blade_Part: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
			Crucifix_Part: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
			Handle_Decory: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
			Base_Crucifix: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
			Decory_Base: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
			Handle_Top: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
			};
		};
		Humanoid: Humanoid & {
			HumanoidDescription: HumanoidDescription;
			Animator: Animator;
		};
		LowerTorso: MeshPart & {
			WaistCenterAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			LeftHipRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			Root: Motor6D;
			RootRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightHipRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			WaistRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			WaistBackAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			WaistFrontAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		RightUpperLeg: MeshPart & {
			RightKneeRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
			RightHip: Motor6D;
			RightHipRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
		};
		RightFoot: MeshPart & {
			RightAnkleRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightAnkle: Motor6D;
			OriginalSize: Vector3Value;
		};
	};
	Vfx: Folder & {
		["Blue's Particle Effect kit"]: Folder;
		["PDS' Particles & Models Kit"]: Folder & {
			["PDS Particle Pack for BSED:R"]: Folder & {
				Map: Folder & {
					Shines: Folder;
					Fogs: Folder;
					["Sparkles&Debris"]: Folder;
					Symbols: Folder;
					Shapes: Folder;
					Beams: Folder;
					Rings: Folder;
					Part: Part;
					MISCELLANEOUS: Folder;
					Nature: Folder;
				};
				UnfixableParticles: Folder & {
					UnfixableParticlesStands: Folder;
					UnfixableParticles: Folder;
					UnfixableParticlesMap: Folder;
				};
				Stands: Folder & {
					Shines: Folder;
					Fogs: Folder;
					["Sparkles&Debris"]: Folder;
					Symbols: Folder;
					Shapes: Folder;
					Beams: Folder;
					Rings: Folder;
					MISCELLANEOUS: Folder;
					Nature: Folder;
				};
				Signs: Folder & {
					MISCELLANEOUS: Folder;
					Fogs: Folder;
					["Sparkles&Debris"]: Folder;
					Symbols: Folder;
					Shapes: Folder;
					Beams: Folder;
					Rings: Folder;
					Part: Part & {
						SurfaceGui: SurfaceGui & {
							TextLabel: TextLabel;
						};
					};
					Nature: Folder;
				};
				Decals: Folder & {
					Shines: Folder;
					Fogs: Folder;
					["Sparkles&Debris"]: Folder;
					Symbols: Folder;
					Shapes: Folder;
					Beams: Folder;
					Rings: Folder;
					MISCELLANEOUS: Folder;
					Nature: Folder;
				};
			};
			["PDS Models Pack for BSED:R"]: Folder & {
				Map: Folder & {
					Part: Part;
				};
				Meshes: Folder;
				Presets: Folder & {
					Samples: Folder & {
						["Pigs Particle Pack V5"]: Folder;
					};
				};
				Stands: Folder;
				Signs: Folder;
				PartTextures: Folder;
			};
			Log: Folder & {
				Part: Part;
			};
		};
	};
	Camera: Camera;
	Temporal: Folder;
	Hitbox: Folder;
	Test: Folder & {
		Ball: Part;
		Model: Model;
	};
	Debris: Folder;
	VFX: Folder & {
		["3DStar"]: MeshPart;
		Shockwaves: MeshPart;
		Slash_Skill1: MeshPart;
		Explosion2: MeshPart;
		FancySlashLight: Part & {
			Weld: Weld;
			Decal2: Decal;
			Mesh: SpecialMesh;
			Decal1: Decal;
		};
		["Meshes/EyeRing"]: MeshPart;
		CircleShockwave: MeshPart & {
			Weld: Weld;
		};
		["Meshes/Shockwave 1"]: MeshPart;
		["Quake ball"]: Part & {
			Part: Part;
		};
		Effect_Skill1: UnionOperation;
		FancyBall: Part;
		["Meshes/newWave"]: MeshPart;
		["slash effect"]: MeshPart;
		["Onda2\"]: MeshPart;
		Spring: MeshPart;
		DecalShockwave: MeshPart;
		Leaf: MeshPart;
		RenderMesh: MeshPart & {
			Dialog: Dialog & {
				DialogChoice: DialogChoice;
			};
		};
		Ring: MeshPart;
		Air: MeshPart;
		FancySlash: Part & {
			Weld: Weld;
			Decal2: Decal;
			Mesh: SpecialMesh;
			Decal1: Decal;
		};
		LightWind: MeshPart;
		GlitchBall: MeshPart;
		GravityBallShockwave: MeshPart & {
			Weld: Weld;
			Config: Folder & {
				Y: NumberValue;
				X: NumberValue;
				Z: NumberValue;
				Duration: IntValue;
				QG: BoolValue;
			};
		};
		["Meshes/spikeyball"]: MeshPart;
		["10smash"]: MeshPart;
		WindB: MeshPart;
		Tornado: MeshPart;
		Part: Part & {
			Mesh: SpecialMesh;
		};
		InvertedSpike: MeshPart;
		Flash: MeshPart;
		Glitch: MeshPart;
		FancySphereLight: MeshPart;
		["Meshes/new Wind"]: MeshPart;
		GroundSpikes: MeshPart;
		SwirlShockwaveFire: MeshPart;
		Whirl: MeshPart;
		SwirlWind: MeshPart;
		["RenderMesh (1)"]: MeshPart;
		Onda: MeshPart;
		["Meshes/WindMesh2"]: MeshPart;
		SemiShock: MeshPart;
		["6smash"]: MeshPart;
		["8smash"]: MeshPart;
		["Blue Explosion"]: Model & {
			["Meshes/EXPLODE low_Cube.002"]: MeshPart;
			["Meshes/EXPLODE low_Cube.003"]: MeshPart;
			["Meshes/EXPLODE low_Cube"]: MeshPart;
			["Meshes/EXPLODE low_Cube.001"]: MeshPart;
		};
		FancySphere: MeshPart;
		["Meshes/shockwave"]: MeshPart;
		InwardShockwave: MeshPart;
		["Meshes/WindMesh1"]: MeshPart;
		G: MeshPart & {
			WeldConstraint: WeldConstraint;
		};
		["Red Explosion"]: Model & {
			["Meshes/EXPLODE low_Cube.002"]: MeshPart;
			["Meshes/EXPLODE low_Cube.003"]: MeshPart;
			["Meshes/EXPLODE low_Cube"]: MeshPart;
			["Meshes/EXPLODE low_Cube.001"]: MeshPart;
		};
		FireBallB: MeshPart;
		Ball: Model;
		ThunderSparkB: MeshPart;
		ThunderSpark: MeshPart;
		Fire: MeshPart;
		Swirl: MeshPart;
		["Meshes/Wave"]: MeshPart;
		ExplosionB: MeshPart;
		Explosion1: MeshPart;
		FireBall: MeshPart;
		["ultra high res sphere"]: MeshPart;
		Vento2: MeshPart;
		GlitchWind: MeshPart;
		Wave3: MeshPart;
		GlitchBallB: MeshPart;
		skill8: Model & {
			Pri: Part;
		};
		["Meshes/WindMesh3"]: MeshPart;
		RoughShockwaveElectricity: MeshPart;
		WindSphere: MeshPart;
		Thunder: MeshPart;
		["Meshes/Beam"]: MeshPart;
		Whirl2: MeshPart;
	};
	["PARTICLE PACK by ReiAkaris"]: Folder & {
		NOTE_A: Part & {
			SurfaceGui: SurfaceGui & {
				TextLabel: TextLabel & {
					UICorner: UICorner;
				};
			};
		};
		NOTE_B: Part & {
			SurfaceGui: SurfaceGui & {
				TextLabel: TextLabel & {
					UICorner: UICorner;
				};
			};
		};
		PACKS: Folder & {
			["06 - LIGHTNING STRIKE [B]"]: Part & {
				RESIDUE: ParticleEmitter;
				LIGHTNING: Attachment & {
					ELECTRIC: ParticleEmitter;
				};
			};
			["08 - PORTAL [B]"]: Part & {
				MIDDLE: Attachment & {
					CORE: ParticleEmitter;
					NEBULAIC: ParticleEmitter;
					COLOR: ParticleEmitter;
					AURA: ParticleEmitter;
					STARS: ParticleEmitter;
				};
			};
			["02 - EXPLOSION [B]"]: Part & {
				MIDDLE: Attachment & {
					EXPLOSION04: ParticleEmitter;
					EXPLOSION02: ParticleEmitter;
					EXPLOSION03: ParticleEmitter;
					EXPLOSION01: ParticleEmitter;
				};
			};
			["04 - BLACK HOLE [B]"]: Part & {
				MIDDLE: Attachment & {
					VOID: ParticleEmitter;
					["CREEPING DARK"]: ParticleEmitter;
					["CORE RING"]: ParticleEmitter;
					ABYSS: ParticleEmitter;
					CORE: ParticleEmitter;
				};
			};
			["07 - PORTAL [A]"]: Part & {
				MIDDLE: Attachment & {
					FIELD: ParticleEmitter;
					CORE: ParticleEmitter;
					AURA: ParticleEmitter;
				};
			};
			["01 - EXPLOSION [A]"]: Part & {
				MIDDLE: Attachment & {
					EXPLOSION04: ParticleEmitter;
					EXPLOSION02: ParticleEmitter;
					EXPLOSION03: ParticleEmitter;
					EXPLOSION01: ParticleEmitter;
				};
			};
			["05 - LIGHTNING STRIKE [A]"]: Part & {
				RESIDUE: ParticleEmitter;
				LIGHTNING: Attachment & {
					ELECTRIC: ParticleEmitter;
				};
			};
			["03 - BLACK HOLE [A]"]: Part & {
				MIDDLE: Attachment & {
					CORE: ParticleEmitter;
					["OUTER RING"]: ParticleEmitter;
					["EVENT HORIZON 01"]: ParticleEmitter;
					["CORE RING"]: ParticleEmitter;
					["EVENT HORIZON 03"]: ParticleEmitter;
					["EVENT HORIZON 02"]: ParticleEmitter;
				};
			};
		};
		THUMBNAIL: Part & {
			SurfaceGui: SurfaceGui & {
				TextLabel: TextLabel & {
					UICorner: UICorner;
				};
				REIAKARIS: ImageLabel & {
					UICorner: UICorner;
				};
			};
		};
		BASE: Folder & {
			["03 - ELECTRICAL"]: Folder & {
				["B - ELECTRICITY 02"]: Part & {
					ELECTRIC: ParticleEmitter;
				};
				["D - ELECTRICITY 04"]: Part & {
					ELECTRIC: ParticleEmitter;
				};
				["E - ELECTRICITY 05"]: Part & {
					ELECTRIC: ParticleEmitter;
				};
				["I - ELECTRIC BURST"]: Part & {
					MIDDLE: Attachment & {
						ELECTRIC: ParticleEmitter;
					};
				};
				["G - LIGHTNING BOLT 01"]: Part & {
					MIDDLE: Attachment & {
						ELECTRIC: ParticleEmitter;
					};
				};
				["H - LIGHTNING BOLT 02"]: Part & {
					MIDDLE: Attachment & {
						ELECTRIC: ParticleEmitter;
					};
				};
				["A - ELECTRICITY 01"]: Part & {
					ELECTRIC: ParticleEmitter;
				};
				["C - ELECTRICITY 03"]: Part & {
					ELECTRIC: ParticleEmitter;
				};
			};
			["07 - STRIKES & EFFECTS"]: Folder & {
				["A - NORMAL STRIKE [A]"]: Part & {
					MIDDLE: Attachment & {
						CIRCLE: ParticleEmitter;
						HIT: ParticleEmitter;
					};
				};
				["B - NORMAL STRIKE [B]"]: Part & {
					MIDDLE: Attachment & {
						STRIKES: ParticleEmitter;
					};
				};
				["C - NORMAL STRIKE [C]"]: Part & {
					MIDDLE: Attachment & {
						STRIKES: ParticleEmitter;
					};
				};
				["D - QUICKSTEP"]: Part & {
					FWOOSH: ParticleEmitter;
				};
				["E -  FAST TRAVEL"]: Part & {
					LINES: ParticleEmitter;
					FWOOSH: ParticleEmitter;
				};
			};
			["05 - SMOKE"]: Folder & {
				["F - SMOKESCREEN [B]"]: Part & {
					SMOKE: ParticleEmitter;
				};
				["C - DARK SMOKE [A]"]: Part & {
					SMOKE: ParticleEmitter;
				};
				["D - DARK SMOKE [B]"]: Part & {
					SMOKE: ParticleEmitter;
				};
				["E - SMOKESCREEN [A]"]: Part & {
					SMOKE: ParticleEmitter;
				};
				["B - SMOKE [B]"]: Part & {
					SMOKE: ParticleEmitter;
				};
				["A - SMOKE [A]"]: Part & {
					SMOKE: ParticleEmitter;
				};
			};
			["02 - WATER"]: Folder & {
				["C - STRONG WATER SPRAY"]: Part & {
					MIDDLE: Attachment & {
						["MAIN SPRAY"]: ParticleEmitter;
					};
					["WATER SPRAY"]: ParticleEmitter;
				};
				["D - BROKEN PIPE"]: Part & {
					MIDDLE: Attachment & {
						["MAIN SPRAY"]: ParticleEmitter;
					};
					["WATER SPRAY"]: ParticleEmitter;
				};
				["F - RAIN, POUR"]: Part & {
					RAIN: ParticleEmitter;
				};
				["A - STEADY RIPPLE"]: Part & {
					RIPPLE: ParticleEmitter;
				};
				["E - STEAM"]: Part & {
					MIDDLE: Attachment & {
						FWSSHHH: ParticleEmitter;
					};
				};
				["F- RAIN, SPLASH"]: Part & {
					RIPPLE: ParticleEmitter;
					SPLASH: ParticleEmitter;
				};
				["B - WATER SPRAY"]: Part & {
					MIDDLE: Attachment & {
						["MAIN SPRAY"]: ParticleEmitter;
					};
					["WATER SPRAY"]: ParticleEmitter;
				};
			};
			["99 - PEDESTALS"]: Folder;
			["08 - MISC"]: Folder & {
				["D - DEADLY GAS"]: Part & {
					SPECKS: ParticleEmitter;
					GAS: ParticleEmitter;
				};
				["G - CHARGE"]: Part & {
					Middle: Attachment & {
						["Main Core"]: ParticleEmitter;
						Charge: ParticleEmitter;
						["Secondary Arcs"]: ParticleEmitter;
						["Primary Arcs"]: ParticleEmitter;
					};
				};
				["I - SHOCK BUBBLE"]: Part & {
					Attachment: Attachment & {
						Bubble: ParticleEmitter;
						Bolts: ParticleEmitter;
					};
				};
				["C - SHINY"]: Part & {
					Shine: ParticleEmitter;
					Glow: ParticleEmitter;
				};
				["K - HOLINESS"]: Part & {
					Middle: Attachment & {
						Core: ParticleEmitter;
						["Shining Circle"]: ParticleEmitter;
						["Singular Rays"]: ParticleEmitter;
					};
				};
				["J - ELECTRIC ORB"]: Part & {
					Middle: Attachment & {
						["Main Core"]: ParticleEmitter;
					};
					Sparks: ParticleEmitter;
				};
				["L - POWER"]: Part & {
					Middle: Attachment & {
						["Main Core"]: ParticleEmitter;
						Charge: ParticleEmitter;
						Vortex: ParticleEmitter;
					};
				};
				["A - POISON"]: Part & {
					POISON: ParticleEmitter;
				};
				["F - ORB"]: Part & {
					Middle: Attachment & {
						["Glowing Core"]: ParticleEmitter;
						["Dark Core"]: ParticleEmitter;
					};
				};
				["E - GLOW"]: Part & {
					Middle: Attachment & {
						Rays: ParticleEmitter;
						["Glowing Core"]: ParticleEmitter;
					};
				};
				["B - TREASURE"]: Part & {
					Middle: Attachment & {
						Core: ParticleEmitter;
						["Surrounding Aura"]: ParticleEmitter;
						["Singular Rays"]: ParticleEmitter;
					};
				};
				["H - VENOM"]: Part & {
					Specks: ParticleEmitter;
					Venom: ParticleEmitter;
				};
			};
			["06 - CUTS & ARCS"]: Folder & {
				["B - SLASHES 01"]: Part & {
					CUTS: ParticleEmitter;
				};
				["F - ARC SLASHES 02"]: Part & {
					CUTS: ParticleEmitter;
				};
				["E - ARC SLASHES 01"]: Part & {
					CUTS: ParticleEmitter;
				};
				["D - MULTIPLE SLASHES"]: Part & {
					CUTS: ParticleEmitter;
				};
				["C - SLASH STRIKE"]: Part & {
					CUTS: ParticleEmitter;
				};
				["A - CUTS 01"]: Part & {
					CUTS: ParticleEmitter;
				};
			};
			["04 - BLOOD"]: Folder & {
				["A - SUDDEN WOUND"]: Part & {
					MIDDLE: Attachment & {
						BLOOD03: ParticleEmitter;
						BLOOD02: ParticleEmitter;
						BLOOD01: ParticleEmitter;
					};
				};
				["D - POOLING BLOOD [A]"]: Part & {
					MIDDLE: Attachment & {
						BLOOD02: ParticleEmitter;
						BLOOD01: ParticleEmitter;
					};
				};
				["E - POOLING BLOOD [B]"]: Part & {
					MIDDLE: Attachment & {
						BLOOD01: ParticleEmitter;
					};
				};
				["C - BLOOD SPLATTER"]: Part & {
					MIDDLE: Attachment & {
						BLOOD02: ParticleEmitter;
						BLOOD01: ParticleEmitter;
					};
				};
				["B - HEMORRHAGE"]: Part & {
					MIDDLE: Attachment & {
						BLOOD02: ParticleEmitter;
						BLOOD01: ParticleEmitter;
					};
				};
			};
			["01 - FLAMES"]: Folder & {
				["D - ROARING FLAMES"]: Part & {
					SPECKS: ParticleEmitter;
					FIRE: ParticleEmitter;
					GLOW: ParticleEmitter;
				};
				["E - FLOOR FLAMES"]: Part & {
					SPECKS: ParticleEmitter;
					["BURNING FLOOR"]: ParticleEmitter;
					FLAMES: ParticleEmitter;
					GLOW: ParticleEmitter;
				};
				["F - RAGING PILLAR"]: Part & {
					FLAMEPILLAR: ParticleEmitter;
					GLOW: ParticleEmitter;
					SPECKS: ParticleEmitter;
					SPIKES: ParticleEmitter;
				};
				["B - FLAMES"]: Part & {
					SPECKS: ParticleEmitter;
					FIRE: ParticleEmitter;
					GLOW: ParticleEmitter;
				};
				["C - STRONG FIRE"]: Part & {
					SPECKS: ParticleEmitter;
					FIRE: ParticleEmitter;
					GLOW: ParticleEmitter;
				};
				["A - CANDLELIGHT"]: Part & {
					MIDDLE: Attachment & {
						GLOW: ParticleEmitter;
						CANDLELIGHT: ParticleEmitter;
					};
				};
			};
		};
	};
}
