class Earthquake < ActiveRecord::Base

	def self.points
		points = []
		Earthquake.all.pluck(:intensity, :latitude, :longitude).each do |earthquake|
			points.push({'intensity' => earthquake[0], 'latitude' => earthquake[1].to_s, 'longitude' => earthquake[2].to_s})
		end
		logger.debug(points)
		return points
	end

end
