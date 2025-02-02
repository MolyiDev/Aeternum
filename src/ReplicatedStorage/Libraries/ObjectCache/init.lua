--!strict
--!native
local FAR_AWAY_CFRAME = CFrame.new(2^24, 2^24, 2^24)
local EXPAND_BY_AMOUNT = 50

local MovingParts = table.create(10_000)
local MovingCFrames = table.create(10_000)

local ScheduledUpdate = false
local function UpdateMovement()
	while true do
		workspace:BulkMoveTo(MovingParts, MovingCFrames, Enum.BulkMoveMode.FireCFrameChanged)

		table.clear(MovingParts)
		table.clear(MovingCFrames)

		ScheduledUpdate = false
		coroutine.yield()
	end
end
local UpdateMovementThread = coroutine.create(UpdateMovement)

local Cache = {}
Cache.__index = Cache

function Cache:_GetNew(Amount: number)
	local FreeObjectsContainer = self._FreeObjects
	local InitialLength = #self._FreeObjects
	local CacheHolder = self.CacheHolder

	local IsTemplateModel = self._IsTemplateModel
	local Template: Model | BasePart = self._Template

	local TargetParts = table.create(Amount)
	local TargetCFrames = table.create(Amount)
	local AddedObjects = table.create(Amount)
	for Index = InitialLength + 1, InitialLength + Amount do
		local Object = Template:Clone()
		local ObjectRoot: BasePart = if IsTemplateModel then (Object:: Model).PrimaryPart:: BasePart else Object:: BasePart

		FreeObjectsContainer[Index] = ObjectRoot

		local OffsetIndex = Index - InitialLength
		TargetParts[OffsetIndex] = ObjectRoot
		TargetCFrames[OffsetIndex] = FAR_AWAY_CFRAME
		AddedObjects[OffsetIndex] = Object
	end

	workspace:BulkMoveTo(TargetParts, TargetCFrames, Enum.BulkMoveMode.FireCFrameChanged)

	for _, Object in AddedObjects do
		(Object:: Instance).Parent = CacheHolder
	end

	return table.remove(FreeObjectsContainer)
end

function Cache:GetPart(PartCFrame: CFrame?): BasePart
	local Part = table.remove(self._FreeObjects) or self:_GetNew(self._ExpandAmount)

	self._Objects[Part] = nil
	if PartCFrame then
		table.insert(MovingParts, Part)
		table.insert(MovingCFrames, PartCFrame)

		if not ScheduledUpdate then
			ScheduledUpdate = true
			task.defer(UpdateMovementThread)
		end
	end

	return Part
end
function Cache:ReturnPart(Part: BasePart)
	if self._Objects[Part] then
		return
	end

	self._Objects[Part] = true

	table.insert(self._FreeObjects, Part)
	table.insert(MovingParts, Part)
	table.insert(MovingCFrames, FAR_AWAY_CFRAME)

	if not ScheduledUpdate then
		ScheduledUpdate = true
		task.defer(UpdateMovementThread)
	end
end

function Cache:Update()
	task.spawn(UpdateMovementThread)
end

function Cache:ExpandCache(Amount: number)
	self:_GetNew(Amount)
end
function Cache:SetExpandAmount(Amount: number)
	self._ExpandAmount = Amount
end

function Cache:IsInUse(Object: BasePart): boolean
	return self._Objects[Object] ~= nil
end

function Cache:Destroy()
	self.CacheHolder:Destroy()
end

local function GetCacheContainer()
	local CacheHolder = Instance.new("Folder")
	CacheHolder.Name = "ObjectCache"

	return CacheHolder
end

local Constructor = {}
function Constructor.new(Template: BasePart | Model, CacheSize: number?, CachesContainer: Instance?)
	local PreallocAmount = CacheSize or 10
	local CacheParent = GetCacheContainer()

	local Objects = table.create(PreallocAmount)
	local FreeObjects: {BasePart | Model} = table.create(PreallocAmount)

	local TargetParts = table.create(PreallocAmount)

	local IsTemplateModel = Template:IsA("Model")
	for Index = 1, PreallocAmount do
		local Object = Template:Clone()
		local ObjectRoot: BasePart = if IsTemplateModel then (Object:: Model).PrimaryPart:: BasePart else Object:: BasePart

		FreeObjects[Index] = Object
		TargetParts[Index] = ObjectRoot

		ObjectRoot.CFrame = FAR_AWAY_CFRAME;
		(Object:: Instance).Parent = CacheParent
	end

	CacheParent.Parent = CachesContainer or workspace

	return setmetatable({
		CacheHolder = CacheParent,
		_ExpandAmount = EXPAND_BY_AMOUNT,
		_Template = Template,
		_FreeObjects = TargetParts,
		_Objects = Objects:: {BasePart: boolean},
		_IsTemplateModel = IsTemplateModel,
		_PreallocatedAmount = PreallocAmount,
	}, Cache)
end

return Constructor