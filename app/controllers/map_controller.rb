class MapController < ApplicationController
  def index
  	gon.eruptions = Eruption.points
  	gon.earthquakes = Earthquake.points
  end
end
