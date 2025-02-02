local RockLibrary = {}

local Workspace = game:GetService("Workspace");
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ObjectCache = require(ReplicatedStorage:WaitForChild("Libraries"):WaitForChild("ObjectCache"))
local SettingsManager = require(ReplicatedStorage:WaitForChild("Managers"):WaitForChild("SettingsManager")).SettingsManager
local ESettingsVisual = require(ReplicatedStorage:WaitForChild("Enums"):WaitForChild("Settings"):WaitForChild("ESettingsVisual")).ESettingsVisual

local CharactersFolders = Workspace:WaitForChild("Characters")
local DebrisFolder = Workspace:WaitForChild("Debris")
local HitboxFolder = Workspace:WaitForChild("Hitbox")
local CacheFolder = Workspace:WaitForChild("Cache")

local Player = Players.LocalPlayer
local Object = ObjectCache.new(script.RockDebris, 500, CacheFolder)

local RayParams = RaycastParams.new()
RayParams.FilterDescendantsInstances = { CharactersFolders, DebrisFolder, HitboxFolder }
RayParams.FilterType = Enum.RaycastFilterType.Exclude
RayParams.IgnoreWater = true

local RayDirection = Vector3.new(0, -20, 0)
local ExplosionVelocitySpread = 180
local ExplosionVectorNormalizer = Vector3.new(-1, 1, -1)
local ExplosionInfo = TweenInfo.new(1.25, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut)

SettingsManager:WaitForSettings(Player)

local ParticlesPercentage
local ParticlesEmit

function RockLibrary._Line(
    Origin: CFrame, 
    Angle: number, 
    Separation: number,
    LineCount: number, 
    Distance: number, 
    StartSize: number, 
    EndSize: number, 
    RocksCount: number, 
    LifeTime: number, 
    TimeIn: number, 
    TimeOut: number, 
    WaitInterval: number)

    local RayResult = Workspace:Raycast(Origin.Position, RayDirection, RayParams)
    if not RayResult then return end
    
	local OldRocksCount = RocksCount
	RocksCount = RocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.Debris)
	local RocksPerLine = RocksCount / LineCount

	if RocksPerLine == 0 then return end

    local startCF = Origin:ToWorldSpace(CFrame.Angles(0,math.rad(-Angle/2),0))

    WaitInterval = math.max((OldRocksCount * (WaitInterval or 0.1)) / RocksCount, 0.001)
    local TimeInInfo = TweenInfo.new(TimeIn or 0.05, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
    local TimeOutInfo = TweenInfo.new(TimeOut or 0.05, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut)

    for i = 1, LineCount do
        local dir
        if LineCount == 1 then
            dir = startCF
        else 
            dir = Origin:ToWorldSpace(CFrame.Angles(0, math.rad(-Angle/2 + (Angle / LineCount) * (i - 0.5)), 0))
        end

        task.spawn(function()
			local lastPosition = startCF.Position
			local lineOffset = startCF.RightVector * Separation * (i - (LineCount + 1) / 2)

            for j = 1, RocksPerLine do
                local size = StartSize + (EndSize - StartSize) * (j / RocksPerLine)
				local torigin = Vector3.new(startCF.Position.X, lastPosition.Y, startCF.Position.Z) + dir.LookVector * (1 + (Distance - 1) * (j / RocksPerLine)) + lineOffset

                RayResult = Workspace:Raycast(torigin + Vector3.new(0, RayDirection.Y / -4, 0), RayDirection, RayParams)
                
                if RayResult then
                    local position = RayResult.Position
					lastPosition = position

                    local Rock = Object:GetPart()
                    Rock.Position = position - Vector3.new(0, size / 2, 0)
                    Rock.Size = Vector3.new(size, size, size)
                    Rock.Material = RayResult.Material
                    Rock.Color = RayResult.Instance.Color
					Rock.Transparency = 0
					Rock.CanCollide = false
					Rock.Anchored = true
                    Rock.Rotation = Vector3.new(math.random(0, 360), math.random(0, 360), math.random(0, 360))
                    TweenService:Create(Rock, TimeInInfo, { Position = position }):Play()

					if math.random() <= ParticlesPercentage then
                        Rock.Smoke.Size = NumberSequence.new(size * math.random(3, 6))
						Rock.Smoke.Color = ColorSequence.new(RayResult.Instance.Color)
                        Rock.Smoke:Emit(ParticlesEmit)
                    end

                    task.delay(LifeTime + math.random(0, 200) / 100, function()
                        local TweenDown = TweenService:Create(Rock, TimeOutInfo, {
							Position = position - Vector3.new(0, size, 0),
							Rotation = Vector3.zero
						})

                        TweenDown.Completed:Once(function()
                            Object:ReturnPart(Rock)
                        end)

                        TweenDown:Play()
                    end)
                end
                
                task.wait(WaitInterval)
            end
        end)
    end
end

function RockLibrary._RandomLine(
    Origin: CFrame, 
    Angle: number, 
	RandomRange: number,
    LineCount: number, 
    Distance: number, 
    StartSize: number, 
    EndSize: number, 
    RocksCount: number, 
    LifeTime: number, 
    TimeIn: number, 
    TimeOut: number, 
    WaitInterval: number)
	local RayResult = Workspace:Raycast(Origin.Position, RayDirection, RayParams)
    if not RayResult then return end
    
	local OldRocksCount = RocksCount
	RocksCount = RocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.Debris)
	local RocksPerLine = RocksCount / LineCount

	if RocksPerLine == 0 then return end

    local startCF = Origin:ToWorldSpace(CFrame.Angles(0,math.rad(-Angle/2),0))

    WaitInterval = math.max((OldRocksCount * (WaitInterval or 0.1)) / RocksCount, 0.001)
    local TimeInInfo = TweenInfo.new(TimeIn or 0.05, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
    local TimeOutInfo = TweenInfo.new(TimeOut or 0.05, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut)

    for i = 1, LineCount do
        local dir
        if LineCount == 1 then
            dir = startCF
        else
            dir = Origin:ToWorldSpace(CFrame.Angles(0, math.rad(-Angle/2 + (Angle / LineCount) * (i - 0.5)), 0))
        end

        task.spawn(function()
			local lastPosition = startCF.Position

            for j = 1, RocksPerLine do
                local size = StartSize + (EndSize - StartSize) * (j / RocksPerLine)
				local randomOffset = Vector3.new(math.random(-RandomRange, RandomRange), 0, math.random(-RandomRange, RandomRange))

				local torigin = Vector3.new(startCF.Position.X, lastPosition.Y, startCF.Position.Z) + dir.LookVector * (1 + (Distance - 1) * (j / RocksPerLine)) + randomOffset

                RayResult = Workspace:Raycast(torigin + Vector3.new(0, RayDirection.Y / -4, 0), RayDirection, RayParams)

                if RayResult then
                    local position = RayResult.Position
					lastPosition = position

                    local Rock = Object:GetPart()
                    Rock.Position = position - Vector3.new(0, size / 2, 0)
                    Rock.Size = Vector3.new(size, size, size)
                    Rock.Material = RayResult.Material
                    Rock.Color = RayResult.Instance.Color
					Rock.Transparency = 0
					Rock.CanCollide = false
					Rock.Anchored = true
                    Rock.Rotation = Vector3.new(math.random(0, 360), math.random(0, 360), math.random(0, 360))
                    TweenService:Create(Rock, TimeInInfo, { Position = position }):Play()

					if math.random() <= ParticlesPercentage then
                        Rock.Smoke.Size = NumberSequence.new(size * math.random(3, 6))
						Rock.Smoke.Color = ColorSequence.new(RayResult.Instance.Color)
                        Rock.Smoke:Emit(ParticlesEmit)
                    end

                    task.delay(LifeTime + math.random(0, 200) / 100, function()
                        local TweenDown = TweenService:Create(Rock, TimeOutInfo, {
							Position = position - Vector3.new(0, size, 0),
							Rotation = Vector3.zero
						})

                        TweenDown.Completed:Once(function()
                            Object:ReturnPart(Rock)
                        end)

                        TweenDown:Play()
                    end)
                end
                
                task.wait(WaitInterval)
            end
        end)
    end
end

function RockLibrary._Explosion(Origin: Vector3, Size: number, Velocity: number, RocksCount: number, LifeTime: number)
	local RayResult = Workspace:Raycast(Origin, RayDirection, RayParams)
	if not RayResult then return end

	RocksCount = RocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.Debris)

	if RocksCount == 0 then return end
	for i = 1, RocksCount do
		local Rock = Object:GetPart()
		Rock.Position = Origin
		Rock.Size = math.random(1, 4) == 4 and Vector3.new(math.random(45, 275) / 100 * 2, math.random(145, 215) / 1000, math.random(45, 275) / 100 * 2) * Size or Vector3.new(math.random(45, 275) / 100, math.random(45, 275) / 100, math.random(45, 275) / 100) * Size
		Rock.Material = RayResult.Material
		Rock.Color = RayResult.Instance.Color
		Rock.Transparency = 0
		Rock.CanCollide = true
		Rock.Anchored = false
		Rock.Rotation = Vector3.new(math.random(0, 360), math.random(0, 360), math.random(0, 360))
			
		local VelocitySpread = Vector3.new(math.random(-ExplosionVelocitySpread, ExplosionVelocitySpread), math.random(-ExplosionVelocitySpread, ExplosionVelocitySpread), math.random(-ExplosionVelocitySpread, ExplosionVelocitySpread))
		VelocitySpread = i % 2 == 0 and VelocitySpread or VelocitySpread * ExplosionVectorNormalizer

		Rock:ApplyImpulse(VelocitySpread.Unit * Velocity * Rock.AssemblyMass)

		task.delay(LifeTime + math.random(0, 200) / 100, function()
			local TweenOut = TweenService:Create(Rock, ExplosionInfo, { Transparency = 1 })
			
			TweenOut.Completed:Once(function()
				Rock.CanCollide = false
				Rock.Anchored = true
				Object:ReturnPart(Rock)
			end)

			TweenOut:Play()
		end)
	end
end

function RockLibrary._Crater(
	Origin: CFrame,
    Radius: number,
    Size: number,
    RocksCount: number,
    SubRocksCount: number,
    LifeTime: number,
	NoSpawnRadius: number,
    TimeIn: number,
    TimeOut: number,
	Irregular: boolean,
	IrregularSize: number
)
	local RayResult = Workspace:Raycast(Origin.Position, RayDirection, RayParams)
	if not RayResult then return end

	RocksCount = RocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.Debris)
	if RocksCount == 0 then return end
	SubRocksCount = SubRocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.SubDebris)

	local TimeInInfo = TweenInfo.new(TimeIn or 0.05, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
	local TimeOutInfo = TweenInfo.new(TimeOut or 0.05, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut)
	local Angle = 0
	local NewCFrame = CFrame.new(RayResult.Position, RayResult.Position + Origin.LookVector)

	local NoSpawnPosition = NewCFrame.Position + NewCFrame.LookVector * NoSpawnRadius

	for i = 1, RocksCount do 
		local StartCF = NewCFrame * CFrame.Angles(0, math.rad(Angle), 0) * CFrame.new(0, 0, -Radius)
		Angle = Angle + (360 / RocksCount)

        if (StartCF.Position - NoSpawnPosition).Magnitude < NoSpawnRadius then continue end

        local NewRay
        if Irregular then
            NewRay = Workspace:Raycast(
                StartCF.Position + RayResult.Normal * 6 + Vector3.new(math.random(-1, 1), 0, math.random(-1, 1)) * IrregularSize,
                RayResult.Normal * -20,
                RayParams
            )
        else
            NewRay = Workspace:Raycast(StartCF.Position + RayResult.Normal * 6, RayResult.Normal * -20, RayParams)
        end
		
        if not NewRay then continue end

        StartCF = CFrame.new(NewRay.Position, RayResult.Position + Vector3.new(0, Radius / 3, 0))

        local Rock = Object:GetPart()
		local RockSize = Vector3.new(math.random(4, 8), math.random(3, 6), math.random(3, 6)) * Size
		local MaxRockSize = math.max(RockSize.X, RockSize.Y, RockSize.Z)
        Rock.Size = RockSize
        Rock.CFrame = StartCF - Vector3.new(0, MaxRockSize / 2, 0)
        Rock.Material = NewRay.Material
        Rock.Color = NewRay.Instance.Color
		Rock.Transparency = 0
		Rock.CanCollide = false
		Rock.Anchored = true
        TweenService:Create(Rock, TimeInInfo, { CFrame = StartCF - Vector3.new(0, 0.3, 0) }):Play()

		if math.random() <= ParticlesPercentage then
			Rock.Smoke.Size = NumberSequence.new(MaxRockSize * math.random(2, 5))
			Rock.Smoke.Color = ColorSequence.new(RayResult.Instance.Color)
			Rock.Smoke:Emit(ParticlesEmit)
		end

		local SubRocks = {}

        task.delay(LifeTime + math.random(0, 200) / 100, function()
			local TweenDown = TweenService:Create(Rock, TimeOutInfo, {
				CFrame = StartCF - Vector3.new(0, MaxRockSize, 0),
			})

			TweenDown.Completed:Once(function()
				for _, SubRock in ipairs(SubRocks) do
					SubRock.WeldConstraint:Destroy()
					SubRock.Anchored = true
					Object:ReturnPart(SubRock)
				end

				Object:ReturnPart(Rock)
			end)

			TweenDown:Play()
        end)

        local randomNumber = math.random(0, SubRocksCount)
        if randomNumber == 0 then continue end
        for j = 1, randomNumber do
            local RockClone = Object:GetPart()
            RockClone.Size = Vector3.new(math.random(3, 5), math.random(2, 3), math.random(2, 4)) * Size
            RockClone.CFrame = Rock.CFrame + Vector3.new(
                (math.random() - 0.5) * 2,
                (math.random() - 0.5) * 2,
                (math.random() - 0.5) * 2
            ) * Size

            RockClone.Material = Rock.Material
            RockClone.Color = Rock.Color
			RockClone.Transparency = 0
			RockClone.CanCollide = false
			RockClone.Anchored = false

            local weld = Instance.new("WeldConstraint", RockClone)
            weld.Part0 = Rock
            weld.Part1 = RockClone

			table.insert(SubRocks, RockClone)
        end
	end
end

function RockLibrary.Line(
	Origin: CFrame,
	Angle: number,
	Separation: number,
	LineCount: number,
	Distance: number,
	StartSize: number,
	EndSize: number,
	RocksCount: number,
	LifeTime: number,
	TimeIn: number,
	TimeOut: number,
	WaitInterval: number)
	task.spawn(function()
		RockLibrary._Line(Origin, Angle, Separation, LineCount, Distance, StartSize, EndSize, RocksCount, LifeTime, TimeIn, TimeOut, WaitInterval)
	end)
end

function RockLibrary.RandomLine(   Origin: CFrame,
    Angle: number,
	RandomRange: number,
    LineCount: number,
    Distance: number,
    StartSize: number,
    EndSize: number,
    RocksCount: number,
    LifeTime: number,
    TimeIn: number,
    TimeOut: number,
    WaitInterval: number)
    task.spawn(function()
        RockLibrary._RandomLine(Origin,
        Angle,
        RandomRange,
        LineCount,
        Distance,
        StartSize,
        EndSize,
        RocksCount,
        LifeTime,
        TimeIn,
        TimeOut,
        WaitInterval)
    end)
end

function RockLibrary.Explosion(Origin: Vector3, Size: number, Velocity: number, RocksCount: number, LifeTime: number)
	task.spawn(function()
		RockLibrary._Explosion(Origin, Size, Velocity, RocksCount, LifeTime)
	end)
end

function RockLibrary.Crater(
	Origin: CFrame,
    Radius: number,
    Size: number,
    RocksCount: number,
    SubRocksCount: number,
    LifeTime: number,
	NoSpawnRadius: number,
    TimeIn: number,
    TimeOut: number,
	Irregular: boolean,
	IrregularSize: number
)
	task.spawn(function()
		RockLibrary._Crater(
			Origin,
			Radius,
			Size,
			RocksCount,
			SubRocksCount,
			LifeTime,
			NoSpawnRadius,
			TimeIn,
			TimeOut,
			Irregular,
			IrregularSize
		)
	end)
end

function CalculateParticles()
	local ParticlesSetting = SettingsManager:GetSetting(Player, ESettingsVisual.Particles)
	
    if ParticlesSetting <= 1 then
        ParticlesPercentage = 0.3 + 0.35 * ParticlesSetting
    else
        ParticlesPercentage = 0.65 + 0.35 * (ParticlesSetting - 1)
    end
	ParticlesEmit = 1
end

Player.AttributeChanged:Connect(function(attribute)
	if attribute ~= ESettingsVisual.Particles then return end
	CalculateParticles()
end)

CalculateParticles()

return RockLibrary