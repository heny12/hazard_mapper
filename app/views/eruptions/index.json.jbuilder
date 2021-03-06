json.array!(@eruptions) do |eruption|
  json.extract! eruption, :id, :year, :month, :day, :tsunami, :earthquake, :name, :location, :country, :latitude, :longitude, :elevation, :eruption_type, :status, :time, :vei, :agent, :death_count, :death_description, :missing_count, :missing_description, :injury_count, :injury_description, :damage_cost, :damage_description, :houses_destroyed, :houses_destroyed_description, :total_deaths, :total_deaths_description, :total_missing, :total_missing_description, :total_injuries, :total_injuries_description, :total_damage_cost, :total_damage_description, :total_houses_destroyed, :total_houses_destroyed_description
  json.url eruption_url(eruption, format: :json)
end
