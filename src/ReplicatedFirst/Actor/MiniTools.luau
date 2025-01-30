local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")

local MiniTools = {}

local TransparencyChanging = {}

function MiniTools.LerpNumber(start: number, final: number, alpha: number): number
    return start + (final - start) * alpha;
end

function MiniTools.TweenTransparency(instance, tweenInfo, finalSequence)
    local connection = TransparencyChanging[instance]
    if connection then
        connection:Disconnect()
    end

    local time = tweenInfo.Time
    local easingStyle = tweenInfo.EasingStyle
    local easingDirection = tweenInfo.EasingDirection

    local startSequence = instance.Transparency.Keypoints

    if #startSequence ~= #finalSequence.Keypoints then
        instance.Transparency = finalSequence
        return
    end

    local timeElapsed = 0

    connection = RunService.RenderStepped:Connect(function(dt)
        timeElapsed += dt
        local alpha = timeElapsed / time

        alpha = TweenService:GetValue(alpha, easingStyle, easingDirection)

        local newKeypoints = {}

        for i = 1, #startSequence do
            local startPoint = startSequence[i]
            local endPoint = finalSequence.Keypoints[i]

            local newValue = startPoint.Value + (endPoint.Value - startPoint.Value) * alpha
            local newTime = startPoint.Time + (endPoint.Time - startPoint.Time) * alpha

            table.insert(newKeypoints, NumberSequenceKeypoint.new(newTime, newValue))
        end

        instance.Transparency = NumberSequence.new(newKeypoints)

        if timeElapsed >= time then
            connection:Disconnect()
            TransparencyChanging[instance] = nil
            instance.Transparency = finalSequence
        end
    end)

    TransparencyChanging[instance] = connection
end

return MiniTools