class EarthquakesController < ApplicationController
  before_action :set_earthquake, only: [:show, :edit, :update, :destroy]

  # GET /earthquakes
  # GET /earthquakes.json
  def index
    @earthquakes = Earthquake.all
  end

  # GET /earthquakes/1
  # GET /earthquakes/1.json
  def show
  end

  # GET /earthquakes/new
  def new
    @earthquake = Earthquake.new
  end

  # GET /earthquakes/1/edit
  def edit
  end

  # POST /earthquakes
  # POST /earthquakes.json
  def create
    @earthquake = Earthquake.new(earthquake_params)

    respond_to do |format|
      if @earthquake.save
        format.html { redirect_to @earthquake, notice: 'Earthquake was successfully created.' }
        format.json { render :show, status: :created, location: @earthquake }
      else
        format.html { render :new }
        format.json { render json: @earthquake.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /earthquakes/1
  # PATCH/PUT /earthquakes/1.json
  def update
    respond_to do |format|
      if @earthquake.update(earthquake_params)
        format.html { redirect_to @earthquake, notice: 'Earthquake was successfully updated.' }
        format.json { render :show, status: :ok, location: @earthquake }
      else
        format.html { render :edit }
        format.json { render json: @earthquake.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /earthquakes/1
  # DELETE /earthquakes/1.json
  def destroy
    @earthquake.destroy
    respond_to do |format|
      format.html { redirect_to earthquakes_url, notice: 'Earthquake was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_earthquake
      @earthquake = Earthquake.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def earthquake_params
      params.require(:earthquake).permit(:usgs_id, :tsunami, :year, :month, :day, :hour, :minute, :second, :focal_depth, :eq_primary, :eq_mag_mw, :eq_mag_ms, :eq_mag_mb, :eq_mag_ml, :eq_mag_mfa, :eq_mag_unk, :intensity, :country, :state, :location, :latitude, :longitude, :region_code, :houses_damaged, :houses_damaged_description, :total_houses_damaged, :total_houses_damaged_description, :death_count, :death_description, :missing_count, :missing_description, :injury_count, :injury_description, :damage_cost, :damage_description, :houses_destroyed, :houses_destroyed_description, :total_deaths, :total_deaths_description, :total_missing, :total_missing_description, :total_injuries, :total_injuries_description, :total_damage_cost, :total_damage_description, :total_houses_destroyed, :total_houses_destroyed_description)
    end
end
