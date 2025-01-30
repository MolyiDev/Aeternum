interface Workspace extends Model {
	Temporal: Folder;
	Camera: Camera;
	R15: Model & {
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
		AnimSaves: ObjectValue & {
			KeyframeSequence: KeyframeSequence;
			KeyframeSequence_1: KeyframeSequence;
		};
		RightHand: MeshPart & {
			RightWristRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			RightWrist: Motor6D;
			RightGripAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
			OriginalSize: Vector3Value;
		};
		HumanoidRootPart: Part & {
			Sword: Motor6D;
			OriginalSize: Vector3Value;
			RootRigAttachment: Attachment & {
				OriginalPosition: Vector3Value;
			};
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
		Sword: MeshPart & {
			SurfaceAppearance: SurfaceAppearance;
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
	Hitbox: Folder;
	Characters: Folder & {
		NPC: Folder & {
			Attacking: Model & {
				LeftLowerArm: MeshPart & {
					LeftLowerArm: WrapTarget;
					OriginalSize: Vector3Value;
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbow: AnimationConstraint;
					LeftElbowBallSocket: BallSocketConstraint;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftFoot: WrapTarget;
					LeftAnkleBallSocket: BallSocketConstraint;
					LeftAnkle: AnimationConstraint;
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
					OriginalSize: Vector3Value;
					RightWristBallSocket: BallSocketConstraint;
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHand: WrapTarget;
					RightWrist: AnimationConstraint;
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
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
					OriginalSize: Vector3Value;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLeg: WrapTarget;
					RightKneeBallSocket: BallSocketConstraint;
					RightKnee: AnimationConstraint;
				};
				LeftUpperLeg: MeshPart & {
					LeftHipBallSocket: BallSocketConstraint;
					LeftHip: AnimationConstraint;
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLegNoCollision: NoCollisionConstraint;
					OriginalSize: Vector3Value;
					LeftFootNoCollision: NoCollisionConstraint;
					LeftUpperLeg: WrapTarget;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftLowerLeg: MeshPart & {
					LeftKnee: AnimationConstraint;
					OriginalSize: Vector3Value;
					LeftKneeBallSocket: BallSocketConstraint;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLeg: WrapTarget;
				};
				Moves: Folder;
				LowerTorso: MeshPart & {
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Root: AnimationConstraint;
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLegNoCollision: NoCollisionConstraint;
					RightUpperArmNoCollision: NoCollisionConstraint;
					LeftUpperArmNoCollision: NoCollisionConstraint;
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
					LeftLowerLegNoCollision: NoCollisionConstraint;
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightUpperArm: MeshPart & {
					RightShoulderBallSocket: BallSocketConstraint;
					RightHandNoCollision: NoCollisionConstraint;
					RightUpperArm: WrapTarget;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulder: AnimationConstraint;
					RightShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
				};
				Head: MeshPart & {
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					Head: WrapTarget;
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckBallSocket: BallSocketConstraint;
					Neck: AnimationConstraint;
					RightUpperArmNoCollision: NoCollisionConstraint;
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftUpperArmNoCollision: NoCollisionConstraint;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				AnimSaves: ObjectValue;
				UpperTorso: MeshPart & {
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					RightLowerLegNoCollision: NoCollisionConstraint;
					LeftUpperLegNoCollision: NoCollisionConstraint;
					LeftShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					LeftLowerArmNoCollision: NoCollisionConstraint;
					UpperTorso: WrapTarget;
					WaistBallSocket: BallSocketConstraint;
					Waist: AnimationConstraint;
					RightLowerArmNoCollision: NoCollisionConstraint;
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLegNoCollision: NoCollisionConstraint;
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLegNoCollision: NoCollisionConstraint;
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				HeadPart: Part & {
					OriginalSize: Vector3Value;
					WeldConstraint: WeldConstraint;
				};
				Abilities: Folder;
				LeftUpperArm: MeshPart & {
					LeftUpperArm: WrapTarget;
					LeftHandNoCollision: NoCollisionConstraint;
					OriginalSize: Vector3Value;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftShoulderBallSocket: BallSocketConstraint;
					LeftShoulder: AnimationConstraint;
					LeftShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
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
					RightElbowBallSocket: BallSocketConstraint;
					RightElbow: AnimationConstraint;
				};
				LeftHand: MeshPart & {
					LeftHand: WrapTarget;
					LeftWristBallSocket: BallSocketConstraint;
					LeftWrist: AnimationConstraint;
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
					Animator: Animator;
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
				};
				Weapons: Folder;
				RightUpperLeg: MeshPart & {
					RightHipBallSocket: BallSocketConstraint;
					OriginalSize: Vector3Value;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHip: AnimationConstraint;
					RightUpperLeg: WrapTarget;
					RightFootNoCollision: NoCollisionConstraint;
				};
				RightFoot: MeshPart & {
					RightFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightAnkleBallSocket: BallSocketConstraint;
					RightAnkle: AnimationConstraint;
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
					LeftElbow: AnimationConstraint;
					LeftElbowBallSocket: BallSocketConstraint;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftFoot: WrapTarget;
					LeftAnkleBallSocket: BallSocketConstraint;
					LeftAnkle: AnimationConstraint;
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
					OriginalSize: Vector3Value;
					RightWristBallSocket: BallSocketConstraint;
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHand: WrapTarget;
					RightWrist: AnimationConstraint;
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
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
					OriginalSize: Vector3Value;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLeg: WrapTarget;
					RightKneeBallSocket: BallSocketConstraint;
					RightKnee: AnimationConstraint;
				};
				LeftUpperLeg: MeshPart & {
					LeftHipBallSocket: BallSocketConstraint;
					LeftHip: AnimationConstraint;
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLegNoCollision: NoCollisionConstraint;
					OriginalSize: Vector3Value;
					LeftFootNoCollision: NoCollisionConstraint;
					LeftUpperLeg: WrapTarget;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftLowerLeg: MeshPart & {
					LeftKnee: AnimationConstraint;
					OriginalSize: Vector3Value;
					LeftKneeBallSocket: BallSocketConstraint;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLeg: WrapTarget;
				};
				Moves: Folder;
				LowerTorso: MeshPart & {
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Root: AnimationConstraint;
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLegNoCollision: NoCollisionConstraint;
					RightUpperArmNoCollision: NoCollisionConstraint;
					LeftUpperArmNoCollision: NoCollisionConstraint;
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
					LeftLowerLegNoCollision: NoCollisionConstraint;
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightUpperArm: MeshPart & {
					RightShoulderBallSocket: BallSocketConstraint;
					RightHandNoCollision: NoCollisionConstraint;
					RightUpperArm: WrapTarget;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulder: AnimationConstraint;
					RightShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
				};
				Head: MeshPart & {
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					Head: WrapTarget;
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckBallSocket: BallSocketConstraint;
					Neck: AnimationConstraint;
					RightUpperArmNoCollision: NoCollisionConstraint;
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftUpperArmNoCollision: NoCollisionConstraint;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				AnimSaves: ObjectValue;
				UpperTorso: MeshPart & {
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					RightLowerLegNoCollision: NoCollisionConstraint;
					LeftUpperLegNoCollision: NoCollisionConstraint;
					LeftShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					LeftLowerArmNoCollision: NoCollisionConstraint;
					UpperTorso: WrapTarget;
					WaistBallSocket: BallSocketConstraint;
					Waist: AnimationConstraint;
					RightLowerArmNoCollision: NoCollisionConstraint;
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLegNoCollision: NoCollisionConstraint;
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLegNoCollision: NoCollisionConstraint;
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				HeadPart: Part & {
					OriginalSize: Vector3Value;
					WeldConstraint: WeldConstraint;
				};
				Abilities: Folder;
				LeftUpperArm: MeshPart & {
					LeftUpperArm: WrapTarget;
					LeftHandNoCollision: NoCollisionConstraint;
					OriginalSize: Vector3Value;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftShoulderBallSocket: BallSocketConstraint;
					LeftShoulder: AnimationConstraint;
					LeftShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
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
					RightElbowBallSocket: BallSocketConstraint;
					RightElbow: AnimationConstraint;
				};
				LeftHand: MeshPart & {
					LeftHand: WrapTarget;
					LeftWristBallSocket: BallSocketConstraint;
					LeftWrist: AnimationConstraint;
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
					Animator: Animator;
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
				};
				Weapons: Folder;
				RightUpperLeg: MeshPart & {
					RightHipBallSocket: BallSocketConstraint;
					OriginalSize: Vector3Value;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHip: AnimationConstraint;
					RightUpperLeg: WrapTarget;
					RightFootNoCollision: NoCollisionConstraint;
				};
				RightFoot: MeshPart & {
					RightFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightAnkleBallSocket: BallSocketConstraint;
					RightAnkle: AnimationConstraint;
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
					LeftElbow: AnimationConstraint;
					LeftElbowBallSocket: BallSocketConstraint;
					LeftWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftFoot: MeshPart & {
					LeftFoot: WrapTarget;
					LeftAnkleBallSocket: BallSocketConstraint;
					LeftAnkle: AnimationConstraint;
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
					OriginalSize: Vector3Value;
					RightWristBallSocket: BallSocketConstraint;
					RightWristRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHand: WrapTarget;
					RightWrist: AnimationConstraint;
					RightGripAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
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
					OriginalSize: Vector3Value;
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLeg: WrapTarget;
					RightKneeBallSocket: BallSocketConstraint;
					RightKnee: AnimationConstraint;
				};
				LeftUpperLeg: MeshPart & {
					LeftHipBallSocket: BallSocketConstraint;
					LeftHip: AnimationConstraint;
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLegNoCollision: NoCollisionConstraint;
					OriginalSize: Vector3Value;
					LeftFootNoCollision: NoCollisionConstraint;
					LeftUpperLeg: WrapTarget;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				LeftLowerLeg: MeshPart & {
					LeftKnee: AnimationConstraint;
					OriginalSize: Vector3Value;
					LeftKneeBallSocket: BallSocketConstraint;
					LeftKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLeg: WrapTarget;
				};
				Moves: Folder;
				LowerTorso: MeshPart & {
					WaistCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					Root: AnimationConstraint;
					WaistBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightLowerLegNoCollision: NoCollisionConstraint;
					RightUpperArmNoCollision: NoCollisionConstraint;
					LeftUpperArmNoCollision: NoCollisionConstraint;
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
					LeftLowerLegNoCollision: NoCollisionConstraint;
					WaistFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				RightUpperArm: MeshPart & {
					RightShoulderBallSocket: BallSocketConstraint;
					RightHandNoCollision: NoCollisionConstraint;
					RightUpperArm: WrapTarget;
					RightElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulder: AnimationConstraint;
					RightShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					RightShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
				};
				Head: MeshPart & {
					HatAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					Head: WrapTarget;
					FaceFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					NeckBallSocket: BallSocketConstraint;
					Neck: AnimationConstraint;
					RightUpperArmNoCollision: NoCollisionConstraint;
					HairAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftUpperArmNoCollision: NoCollisionConstraint;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					FaceCenterAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				AnimSaves: ObjectValue;
				UpperTorso: MeshPart & {
					RightCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					NeckRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					RightLowerLegNoCollision: NoCollisionConstraint;
					LeftUpperLegNoCollision: NoCollisionConstraint;
					LeftShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
						OriginalPosition: Vector3Value;
					};
					LeftLowerArmNoCollision: NoCollisionConstraint;
					UpperTorso: WrapTarget;
					WaistBallSocket: BallSocketConstraint;
					Waist: AnimationConstraint;
					RightLowerArmNoCollision: NoCollisionConstraint;
					BodyBackAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftCollarAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightUpperLegNoCollision: NoCollisionConstraint;
					BodyFrontAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					WaistRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftLowerLegNoCollision: NoCollisionConstraint;
					NeckAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
				HeadPart: Part & {
					OriginalSize: Vector3Value;
					WeldConstraint: WeldConstraint;
				};
				Abilities: Folder;
				LeftUpperArm: MeshPart & {
					LeftUpperArm: WrapTarget;
					LeftHandNoCollision: NoCollisionConstraint;
					OriginalSize: Vector3Value;
					LeftShoulderAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftElbowRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					LeftShoulderBallSocket: BallSocketConstraint;
					LeftShoulder: AnimationConstraint;
					LeftShoulderRigAttachment: Attachment & {
						JointRotation: Attachment;
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
					RightElbowBallSocket: BallSocketConstraint;
					RightElbow: AnimationConstraint;
				};
				LeftHand: MeshPart & {
					LeftHand: WrapTarget;
					LeftWristBallSocket: BallSocketConstraint;
					LeftWrist: AnimationConstraint;
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
					Animator: Animator;
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
				};
				Weapons: Folder;
				RightUpperLeg: MeshPart & {
					RightHipBallSocket: BallSocketConstraint;
					OriginalSize: Vector3Value;
					RightHipRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightKneeRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					RightHip: AnimationConstraint;
					RightUpperLeg: WrapTarget;
					RightFootNoCollision: NoCollisionConstraint;
				};
				RightFoot: MeshPart & {
					RightFootAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
					OriginalSize: Vector3Value;
					RightAnkleBallSocket: BallSocketConstraint;
					RightAnkle: AnimationConstraint;
					RightFoot: WrapTarget;
					RightAnkleRigAttachment: Attachment & {
						OriginalPosition: Vector3Value;
					};
				};
			};
		};
	};
	Debris: Folder;
	["R15 Dummy"]: Model & {
		LeftLowerArm: MeshPart & {
			LeftElbowRigAttachment: Attachment;
			LeftElbow: Motor6D;
			OriginalSize: Vector3Value;
			LeftWristRigAttachment: Attachment;
		};
		LeftFoot: MeshPart & {
			LeftAnkleRigAttachment: Attachment;
			OriginalSize: Vector3Value;
			LeftAnkle: Motor6D;
		};
		AnimSaves: ObjectValue;
		RightHand: MeshPart & {
			RightWristRigAttachment: Attachment;
			RightWrist: Motor6D;
			RightGripAttachment: Attachment;
			OriginalSize: Vector3Value;
		};
		HumanoidRootPart: Part & {
			RootRigAttachment: Attachment;
			OriginalSize: Vector3Value;
		};
		RightLowerLeg: MeshPart & {
			RightKneeRigAttachment: Attachment;
			RightAnkleRigAttachment: Attachment;
			OriginalSize: Vector3Value;
			RightKnee: Motor6D;
		};
		LeftUpperLeg: MeshPart & {
			LeftHip: Motor6D;
			OriginalSize: Vector3Value;
			LeftHipRigAttachment: Attachment;
			LeftKneeRigAttachment: Attachment;
		};
		LeftLowerLeg: MeshPart & {
			OriginalSize: Vector3Value;
			LeftKnee: Motor6D;
			LeftAnkleRigAttachment: Attachment;
			LeftKneeRigAttachment: Attachment;
		};
		LowerTorso: MeshPart & {
			WaistCenterAttachment: Attachment;
			LeftHipRigAttachment: Attachment;
			Root: Motor6D;
			RootRigAttachment: Attachment;
			RightHipRigAttachment: Attachment;
			OriginalSize: Vector3Value;
			WaistRigAttachment: Attachment;
			WaistBackAttachment: Attachment;
			WaistFrontAttachment: Attachment;
		};
		Head: Part & {
			HatAttachment: Attachment;
			OriginalSize: Vector3Value;
			NeckRigAttachment: Attachment;
			FaceFrontAttachment: Attachment;
			face: Decal;
			HairAttachment: Attachment;
			Neck: Motor6D;
			Mesh: SpecialMesh;
			FaceCenterAttachment: Attachment;
		};
		UpperTorso: MeshPart & {
			RightCollarAttachment: Attachment;
			BodyBackAttachment: Attachment;
			NeckRigAttachment: Attachment;
			LeftCollarAttachment: Attachment;
			Waist: Motor6D;
			OriginalSize: Vector3Value;
			RightShoulderRigAttachment: Attachment;
			BodyFrontAttachment: Attachment;
			WaistRigAttachment: Attachment;
			LeftShoulderRigAttachment: Attachment;
			NeckAttachment: Attachment;
		};
		LeftUpperArm: MeshPart & {
			LeftShoulderRigAttachment: Attachment;
			OriginalSize: Vector3Value;
			LeftShoulderAttachment: Attachment;
			LeftElbowRigAttachment: Attachment;
			LeftShoulder: Motor6D;
		};
		RightLowerArm: MeshPart & {
			RightWristRigAttachment: Attachment;
			RightElbow: Motor6D;
			OriginalSize: Vector3Value;
			RightElbowRigAttachment: Attachment;
		};
		LeftHand: MeshPart & {
			LeftWrist: Motor6D;
			LeftGripAttachment: Attachment;
			OriginalSize: Vector3Value;
			LeftWristRigAttachment: Attachment;
		};
		Humanoid: Humanoid & {
			Animator: Animator;
		};
		RightUpperArm: MeshPart & {
			OriginalSize: Vector3Value;
			RightElbowRigAttachment: Attachment;
			RightShoulderRigAttachment: Attachment;
			RightShoulderAttachment: Attachment;
			RightShoulder: Motor6D;
		};
		RightUpperLeg: MeshPart & {
			RightKneeRigAttachment: Attachment;
			RightHip: Motor6D;
			OriginalSize: Vector3Value;
			RightHipRigAttachment: Attachment;
		};
		RightFoot: MeshPart & {
			RightAnkleRigAttachment: Attachment;
			OriginalSize: Vector3Value;
			RightAnkle: Motor6D;
		};
	};
}
