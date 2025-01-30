-- Starting Services
local Players = game:GetService("Players")
local ReplicatedFirst = game:GetService("ReplicatedFirst")
local StarterGui = game:GetService("StarterGui")
local UserInputService = game:GetService("UserInputService")

-- Starting Variables
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local loadingUI = script.Parent:WaitForChild("LoadingUI"):Clone()

ReplicatedFirst:RemoveDefaultLoadingScreen()
loadingUI.Parent = playerGui
UserInputService.MouseIconEnabled = false
StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.All, false)

if not game:IsLoaded() then game.Loaded:Wait() end

-- Final Services
local ContentProvider = game:GetService("ContentProvider")
local MiniTools = require(script.Parent:WaitForChild("MiniTools"))

-- Final Variables
local tips = {
	"TipTest1",
	"TipTest2",
	"TipTest3",
	"TipTest4",
	"TipTest5",
	"TipTest6",
	"TipTest7",
	"TipTest8",
}

local stopTips = false
local loadingGroup = loadingUI:WaitForChild("LoadingGroup")
local loadingBar = loadingGroup:WaitForChild("LoadingBar")
local loadingGradient = loadingBar:WaitForChild("Bar"):WaitForChild("UIGradient")

-- Texts
local textLoading = loadingBar:WaitForChild("TextLoading")
local textTip = loadingGroup:WaitForChild("TextTip")

task.wait(0.25)

local assets = game:GetDescendants()
local maxAssets = #assets
local assetsLoaded = 0

textLoading.Text = 0 .. " / " .. maxAssets

task.spawn(function()
	local availableTips = { unpack(tips) }

	while not stopTips and #availableTips > 0 do
		local randomIndex = math.random(1, #availableTips)

		textTip.Text = availableTips[randomIndex]
		table.remove(availableTips, randomIndex)

		task.wait(3)
	end
end)

task.wait(0.15)
local TInfoBar = TweenInfo.new(0.35, Enum.EasingStyle.Linear)

local function updateLoadingBar(generalPercentage)
	local zeroOrOne = (generalPercentage == 0) and 1 or 0;
	local oneOrZero = (generalPercentage == 100) and 0 or 1;

	local midLeft = NumberSequenceKeypoint.new(MiniTools.LerpNumber(0, 1, 1 - generalPercentage), oneOrZero);
	local midRight = NumberSequenceKeypoint.new(MiniTools.LerpNumber(0.02, 1, 1 - generalPercentage), zeroOrOne);

	MiniTools.TweenTransparency(loadingGradient, TInfoBar, NumberSequence.new({
		NumberSequenceKeypoint.new(0, oneOrZero),
		midLeft,
		midRight,
		NumberSequenceKeypoint.new(1, zeroOrOne),
	}))
end

local function loadGroup(startIndex, endIndex)
	local group = {}
	for i = startIndex, endIndex do
		table.insert(group, assets[i])
	end

	ContentProvider:PreloadAsync(group)
	assetsLoaded = assetsLoaded + #group
	textLoading.Text = assetsLoaded .. " / " .. maxAssets

	updateLoadingBar(math.clamp((assetsLoaded / maxAssets), 0, 1))
end

local index = 1
while index <= maxAssets do
	local groupSize = math.random(math.floor(maxAssets/16), math.floor(maxAssets/4))
	local endIndex = math.min(index + groupSize - 1, maxAssets)

	loadGroup(index, endIndex)

	index = endIndex + 1
	task.wait(math.random(0.15, 0.85))
end

task.wait(1.5)
local tweenInfoAll = TweenInfo.new(2, Enum.EasingStyle.Linear)
game:GetService("TweenService"):Create(loadingGroup, tweenInfoAll, { GroupTransparency = 1  }):Play()

task.wait(1.25)
UserInputService.MouseIconEnabled = true

task.wait(1.25)

stopTips = true
loadingUI:Destroy()