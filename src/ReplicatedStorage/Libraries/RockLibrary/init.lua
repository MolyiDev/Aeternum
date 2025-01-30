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

function RandomOutsideRange(min: number, max: number, excludeRangeMin: number, excludeRangeMax: number)
	local Range1 = math.random(min, excludeRangeMin)
	local Range2 = math.random(excludeRangeMax, max)

	return math.random() < 0.5 and Range1 or Range2
end

function RockLibrary._Line(
    Origin: CFrame, 
    Angle: number, 
    Separation: number,
    LineCount: number, 
    Distance: number, 
    StartSize: number, 
    EndSize: number, 
    RocksCount: number, 
    SubRocksCount: number,
    LifeTime: number, 
    TimeIn: number, 
    TimeOut: number, 
    WaitInterval: number)

    local RayResult = Workspace:Raycast(Origin.Position, RayDirection, RayParams)
    if not RayResult then return end
    
    local startCF = Origin:ToWorldSpace(CFrame.Angles(0,math.rad(-Angle/2),0))

	local NewRocksCount = RocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.Debris)
	local ParticlesPercentage = SettingsManager:GetSetting(Player, ESettingsVisual.Particles) / 2
    SubRocksCount = SubRocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.SubDebris)

    WaitInterval = math.max((RocksCount * (WaitInterval or 0.1)) / NewRocksCount, 0.001)

	RocksCount = NewRocksCount
    local TimeInInfo = TweenInfo.new(TimeIn or 0.05, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
    local TimeOutInfo = TweenInfo.new(TimeOut or 0.05, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut)

    local rocksPerLine = RocksCount / LineCount

    for i = 1, LineCount do
        local dir
        if LineCount == 1 then
            dir = startCF
        else 
            dir = startCF:ToWorldSpace(CFrame.Angles(0, math.rad(Angle / (LineCount - 1) * (i - 1)), 0))
        end

        task.spawn(function()
			local lastPosition = startCF.Position
			local lineOffset = startCF.RightVector * Separation * (i - (LineCount + 1) / 2)

            for j = 1, rocksPerLine do
                local size = StartSize + (EndSize - StartSize) * (j / rocksPerLine)
				local torigin = Vector3.new(startCF.Position.X, lastPosition.Y, startCF.Position.Z) + dir.LookVector * (1 + (Distance - 1) * (j / rocksPerLine)) + lineOffset

                RayResult = Workspace:Raycast(torigin + Vector3.new(0, RayDirection.Y / -4, 0), RayDirection, RayParams)
                
                if RayResult then
                    local position = RayResult.Position
					lastPosition = position

                    local Rock = Object:GetPart()
                    Rock.Position = position - Vector3.new(0, size / 2, 0)
                    Rock.Size = Vector3.new(size, size, size)
                    Rock.Parent = DebrisFolder
                    Rock.Material = RayResult.Material
                    Rock.Color = RayResult.Instance.Color
					Rock.Transparency = 0
					Rock.CanCollide = false
					Rock.Anchored = true
					Rock.Massless = true
                    Rock.Rotation = Vector3.new(math.random(0, 360), math.random(0, 360), math.random(0, 360))
                    TweenService:Create(Rock, TimeInInfo, { Position = position }):Play()

					if math.random() <= ParticlesPercentage then
                        Rock.Smoke.Size = NumberSequence.new(size * math.random(3, 6))
						Rock.Smoke.Color = ColorSequence.new(RayResult.Instance.Color)
                        Rock.Smoke:Emit(1)
                    end

                    task.delay(LifeTime + math.random(0, 2), function()
                        local TweenDown = TweenService:Create(Rock, TimeOutInfo, {Position = position - Vector3.new(0, size, 0), Rotation = Vector3.zero})

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

function RockLibrary._Explosion(Origin: Vector3, Size: number, Velocity: number, TotalRocks: number, LifeTime: number)
	local RayResult = Workspace:Raycast(Origin, RayDirection, RayParams)
	if not RayResult then return end

	TotalRocks = TotalRocks * SettingsManager:GetSetting(Player, ESettingsVisual.Debris)

	for i = 1, TotalRocks do
		local Rock = Object:GetPart()
		Rock.Position = Origin
		Rock.Size = Vector3.new(math.random(0.5, 2.5), math.random(0.5, 2.5), math.random(0.5, 2.5)) * Size
		Rock.Parent = DebrisFolder
		Rock.Material = RayResult.Material
		Rock.Color = RayResult.Instance.Color
		Rock.Transparency = 0
		Rock.CanCollide = true
		Rock.Anchored = false
		Rock.Massless = false
		Rock.Rotation = Vector3.new(math.random(0, 360), math.random(0, 360), math.random(0, 360))
			
		local VelocitySpread = Vector3.new(math.random(-ExplosionVelocitySpread, ExplosionVelocitySpread), math.random(-ExplosionVelocitySpread, ExplosionVelocitySpread), math.random(-ExplosionVelocitySpread, ExplosionVelocitySpread))
		VelocitySpread = i % 2 == 0 and VelocitySpread or VelocitySpread * ExplosionVectorNormalizer

		Rock:ApplyImpulse(VelocitySpread.Unit * Velocity * Rock.AssemblyMass)

		task.delay(LifeTime + math.random(0, 2), function()
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

function RockLibrary.Crater(
	Origin: Vector3,
    Direction: Vector3,
    RayDirection: Vector3,
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
	local result = Workspace:Raycast(Origin, RayDirection, RayParams)
    if not result then return end
    
    local startCF = CFrame.new(result.Position, result.Position + Direction)
    startCF = startCF:ToWorldSpace(CFrame.Angles(0,math.rad(-Angle/2),0))

    local TimeInInfo = TweenInfo.new(TimeIn or 0.05, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
    local TimeOutInfo = TweenInfo.new(TimeOut or 0.05, Enum.EasingStyle.Quad, Enum.EasingDirection.In)

    RocksCount = RocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.Debris)
    SubRocksCount = SubRocksCount * SettingsManager:GetSetting(Player, ESettingsVisual.SubDebris)

    local rocksPerLine = RocksCount / LineCount

	local amount = rocksPerLine + math.round(math.random(rocksPerLine*3,rocksPerLine*5)/(rocksPerLine))
	task.spawn(function()
		for j = 1, amount do
			local size = StartSize + (EndSize - StartSize) * (j / amount)
			local torigin = startCF.Position + dir.LookVector * (1 + (Distance - 1) * (j / amount)) + dir.LookVector * StartDistance + lineOffset

			result = Workspace:Raycast(torigin + Vector3.new(0, RayDirection.Y / -2, 0), RayDirection, RayParams)
			
			if result then
				local position = result.Position
				local rock = Object:GetPart()
				rock.Position = position - Vector3.new(0, size / 2, 0)
				rock.Size = Vector3.new(size, size, size)
				rock.Parent = DebrisFolder
				rock.Material = result.Material
				rock.Color = result.Instance.Color
				rock.Rotation = Vector3.new(math.random(0, 360), math.random(0, 360), math.random(0, 360))
				TweenService:Create(rock, TimeInInfo, { Position = position }):Play()

				if (math.random(j, amount) / amount) >= 0.75 then
					rock.Smoke.Size = NumberSequence.new(size * math.random(3,6))
					rock.Smoke:Emit(1)
				end

				task.delay(LifeTime + math.random(0, 2), function()
					local Tween = TweenService:Create(rock, TimeOutInfo, {Position = position - Vector3.new(0, size, 0)})

					Tween.Completed:Once(function()
						Object:ReturnPart(rock)
					end)

					Tween:Play()
				end)
			end
			
			if WaitInterval ~= 0 then task.wait(WaitInterval) end
		end
	end)
end


function RockLibrary.RandomLine()
	
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
	SubRocksCount: number,
	LifeTime: number,
	TimeIn: number,
	TimeOut: number,
	WaitInterval: number)
	task.spawn(function()
		RockLibrary._Line(Origin, Angle, Separation, LineCount, Distance, StartSize, EndSize, RocksCount, SubRocksCount, LifeTime, TimeIn, TimeOut, WaitInterval)
	end)
end

function RockLibrary.Explosion(Origin: Vector3, Size: number, Velocity: number, TotalRocks: number, LifeTime: number)
	task.spawn(function()
		RockLibrary._Explosion(Origin, Size, Velocity, TotalRocks, LifeTime)
	end)
end

return RockLibrary