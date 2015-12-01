require 'test_helper'

class EarthquakesControllerTest < ActionController::TestCase
  setup do
    @earthquake = earthquakes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:earthquakes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create earthquake" do
    assert_difference('Earthquake.count') do
      post :create, earthquake: { country: @earthquake.country, damage_cost: @earthquake.damage_cost, damage_description: @earthquake.damage_description, day: @earthquake.day, death_count: @earthquake.death_count, death_description: @earthquake.death_description, eq_mag_mb: @earthquake.eq_mag_mb, eq_mag_mfa: @earthquake.eq_mag_mfa, eq_mag_ml: @earthquake.eq_mag_ml, eq_mag_ms: @earthquake.eq_mag_ms, eq_mag_mw: @earthquake.eq_mag_mw, eq_mag_unk: @earthquake.eq_mag_unk, eq_primary: @earthquake.eq_primary, focal_depth: @earthquake.focal_depth, hour: @earthquake.hour, houses_damaged: @earthquake.houses_damaged, houses_damaged_description: @earthquake.houses_damaged_description, houses_destroyed: @earthquake.houses_destroyed, houses_destroyed_description: @earthquake.houses_destroyed_description, injury_count: @earthquake.injury_count, injury_description: @earthquake.injury_description, intensity: @earthquake.intensity, latitude: @earthquake.latitude, location: @earthquake.location, longitude: @earthquake.longitude, minute: @earthquake.minute, missing_count: @earthquake.missing_count, missing_description: @earthquake.missing_description, month: @earthquake.month, region_code: @earthquake.region_code, second: @earthquake.second, state: @earthquake.state, total_damage_cost: @earthquake.total_damage_cost, total_damage_description: @earthquake.total_damage_description, total_deaths: @earthquake.total_deaths, total_deaths_description: @earthquake.total_deaths_description, total_houses_damaged: @earthquake.total_houses_damaged, total_houses_damaged_description: @earthquake.total_houses_damaged_description, total_houses_destroyed: @earthquake.total_houses_destroyed, total_houses_destroyed_description: @earthquake.total_houses_destroyed_description, total_injuries: @earthquake.total_injuries, total_injuries_description: @earthquake.total_injuries_description, total_missing: @earthquake.total_missing, total_missing_description: @earthquake.total_missing_description, tsunami: @earthquake.tsunami, usgs_id: @earthquake.usgs_id, year: @earthquake.year }
    end

    assert_redirected_to earthquake_path(assigns(:earthquake))
  end

  test "should show earthquake" do
    get :show, id: @earthquake
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @earthquake
    assert_response :success
  end

  test "should update earthquake" do
    patch :update, id: @earthquake, earthquake: { country: @earthquake.country, damage_cost: @earthquake.damage_cost, damage_description: @earthquake.damage_description, day: @earthquake.day, death_count: @earthquake.death_count, death_description: @earthquake.death_description, eq_mag_mb: @earthquake.eq_mag_mb, eq_mag_mfa: @earthquake.eq_mag_mfa, eq_mag_ml: @earthquake.eq_mag_ml, eq_mag_ms: @earthquake.eq_mag_ms, eq_mag_mw: @earthquake.eq_mag_mw, eq_mag_unk: @earthquake.eq_mag_unk, eq_primary: @earthquake.eq_primary, focal_depth: @earthquake.focal_depth, hour: @earthquake.hour, houses_damaged: @earthquake.houses_damaged, houses_damaged_description: @earthquake.houses_damaged_description, houses_destroyed: @earthquake.houses_destroyed, houses_destroyed_description: @earthquake.houses_destroyed_description, injury_count: @earthquake.injury_count, injury_description: @earthquake.injury_description, intensity: @earthquake.intensity, latitude: @earthquake.latitude, location: @earthquake.location, longitude: @earthquake.longitude, minute: @earthquake.minute, missing_count: @earthquake.missing_count, missing_description: @earthquake.missing_description, month: @earthquake.month, region_code: @earthquake.region_code, second: @earthquake.second, state: @earthquake.state, total_damage_cost: @earthquake.total_damage_cost, total_damage_description: @earthquake.total_damage_description, total_deaths: @earthquake.total_deaths, total_deaths_description: @earthquake.total_deaths_description, total_houses_damaged: @earthquake.total_houses_damaged, total_houses_damaged_description: @earthquake.total_houses_damaged_description, total_houses_destroyed: @earthquake.total_houses_destroyed, total_houses_destroyed_description: @earthquake.total_houses_destroyed_description, total_injuries: @earthquake.total_injuries, total_injuries_description: @earthquake.total_injuries_description, total_missing: @earthquake.total_missing, total_missing_description: @earthquake.total_missing_description, tsunami: @earthquake.tsunami, usgs_id: @earthquake.usgs_id, year: @earthquake.year }
    assert_redirected_to earthquake_path(assigns(:earthquake))
  end

  test "should destroy earthquake" do
    assert_difference('Earthquake.count', -1) do
      delete :destroy, id: @earthquake
    end

    assert_redirected_to earthquakes_path
  end
end
