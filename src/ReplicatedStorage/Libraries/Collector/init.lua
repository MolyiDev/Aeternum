--DEFINE MODULE--
local Collector = {}

--PUBLIC VARIABLES--
export type DebrisItem = {
	Object: Instance,
	Lifetime: number,
	Time: number
}

--PRIVATE FUNCTIONS--
local function Init()
	if not shared.Collector then
		shared.Collector = {}
	end
	
	if not shared.Collector.Storage then
		shared.Collector.Storage = {}
		
		shared.Collector.MaximumScansPerCycle = 255
		shared.Collector.MaximumRemovalsPerCycle = 4096
		
		shared.Collector.Coroutine = task.spawn(function()
			while task.wait() do
				local MarkedForDeletion = {}
				local ObjectsScanned = 0
				local ObjectsRemoved = 0
				
				for i, Item: DebrisItem in pairs(shared.Collector.Storage) do
					if time() - Item.Time >= Item.Lifetime then
						table.insert(MarkedForDeletion, Item.Object)
					end
					
					if ObjectsScanned % shared.Collector.MaximumScansPerCycle == 0 then
						task.wait()
					end
					
					ObjectsScanned += 1
				end
				
				for _, Object: Instance in pairs(MarkedForDeletion) do
					if shared.Collector.Storage[Object] then
						shared.Collector.Storage[Object].Object:Destroy()
						shared.Collector.Storage[Object] = nil
					end
					
					if ObjectsRemoved % shared.Collector.MaximumRemovalsPerCycle == 0 then
						task.wait()
					end
					
					ObjectsRemoved += 1
				end
			end
		end)
	end
end

--PUBLIC FUNCTIONS--
function Collector:AddItem(Object: Instance, Lifetime: number)
	local Item: DebrisItem = {
		Object = Object,
		Lifetime = Lifetime - 1,
		Time = time()
	}
	
	if not shared.Collector.Storage[Object] then
		shared.Collector.Storage[Object] = Item
	end
end

--INIT--
Init()

--RETURN MODULE--
return Collector