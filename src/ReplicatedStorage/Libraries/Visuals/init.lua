-- // Visual Config
local CONE_HEIGHT = 1
local LINE_THICKNESS = 15
local TRANSPARENCY = 0
local ALWAYS_ON_TOP = false

-- // CastVisualiser Class
local CastVisualiser = {}

-- // Private Methods \\ --

-- // Public Methods \\ --
function CastVisualiser:Hide()
	self.CastOriginPart.Parent = nil
end

function CastVisualiser:Raycast(Origin: Vector3, Direction: Vector3)
	local self: CastVisualiserPrivate = self
	
	self.CastOriginPart.CFrame = CFrame.lookAt(Origin, Origin + Direction)
	self.CastOriginPart.Parent = self.WorldRoot:FindFirstChild("Terrain") or self.WorldRoot
end

function CastVisualiser:Destroy()
	self.CastOriginPart:Destroy()
 
	self.LineVisual = nil
	self.CastOriginPart = nil
	self.WorldRoot = nil
 end

-- Types
export type CastVisualiser = typeof(CastVisualiser)
type CastVisualiserPrivate = CastVisualiser & {
	Color: Color3,
	WorldRoot: WorldRoot,
	CastOriginPart: BasePart,
	
	LineVisual: LineHandleAdornment,
}


-- // Main
local Visuals = {}

local Meta = {__index = CastVisualiser}

function Visuals.new(Color: Color3?, WorldRoot: WorldRoot?): CastVisualiser
	local self: CastVisualiserPrivate = setmetatable({
		Color = Color or Color3.new(0, 0, 1),
		WorldRoot = WorldRoot or workspace,
	}, Meta)
	
	-- Origin Part
	local CastOriginPart = Instance.new("Part")
	CastOriginPart.Transparency = 1
	CastOriginPart.CanCollide = false
	CastOriginPart.CanQuery = false
	CastOriginPart.CanTouch = false
	CastOriginPart.Anchored = true
	CastOriginPart.Size = Vector3.one / 100

	self.CastOriginPart = CastOriginPart
	
	-- Visuals
	local LineHandleAdornment = Instance.new("LineHandleAdornment")
	LineHandleAdornment.Color3 = self.Color
	LineHandleAdornment.AlwaysOnTop = ALWAYS_ON_TOP
	LineHandleAdornment.Transparency = TRANSPARENCY
	LineHandleAdornment.Thickness = LINE_THICKNESS
	LineHandleAdornment.Length = 15
	LineHandleAdornment.ZIndex = 1
	LineHandleAdornment.Adornee = CastOriginPart
	LineHandleAdornment.Parent = CastOriginPart
	
	self.LineVisual = LineHandleAdornment
	
	--[[local ConeHandleAdornmnet = Instance.new("ConeHandleAdornment")
	ConeHandleAdornmnet.Color3 = self.Color
	ConeHandleAdornmnet.AlwaysOnTop = ALWAYS_ON_TOP
	ConeHandleAdornmnet.Transparency = TRANSPARENCY
	ConeHandleAdornmnet.Radius = 0.05
	ConeHandleAdornmnet.Height = CONE_HEIGHT
	ConeHandleAdornmnet.SizeRelativeOffset = Vector3.new(0, 0, CONE_HEIGHT * 2)
	ConeHandleAdornmnet.ZIndex = 1
	ConeHandleAdornmnet.Adornee = CastOriginPart
	ConeHandleAdornmnet.Parent = CastOriginPart
	
	self.ConeVisual = ConeHandleAdornmnet]]--
	
	return self
end

return Visuals