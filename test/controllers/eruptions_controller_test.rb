require 'test_helper'

class EruptionsControllerTest < ActionController::TestCase
  setup do
    @eruption = eruptions(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:eruptions)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create eruption" do
    assert_difference('Eruption.count') do
      post :create, eruption: { agent: @eruption.agent, country: @eruption.country, damage_cost: @eruption.damage_cost, damage_description: @eruption.damage_description, day: @eruption.day, death_count: @eruption.death_count, death_description: @eruption.death_description, earthquake: @eruption.earthquake, elevation: @eruption.elevation, eruption_type: @eruption.eruption_type, houses_destroyed: @eruption.houses_destroyed, houses_destroyed_description: @eruption.houses_destroyed_description, injury_count: @eruption.injury_count, injury_description: @eruption.injury_description, latitude: @eruption.latitude, location: @eruption.location, longitude: @eruption.longitude, missing_count: @eruption.missing_count, missing_description: @eruption.missing_description, month: @eruption.month, name: @eruption.name, status: @eruption.status, time: @eruption.time, total_damage_cost: @eruption.total_damage_cost, total_damage_description: @eruption.total_damage_description, total_deaths: @eruption.total_deaths, total_deaths_description: @eruption.total_deaths_description, total_houses_destroyed: @eruption.total_houses_destroyed, total_houses_destroyed_description: @eruption.total_houses_destroyed_description, total_injuries: @eruption.total_injuries, total_injuries_description: @eruption.total_injuries_description, total_missing: @eruption.total_missing, total_missing_description: @eruption.total_missing_description, tsunami: @eruption.tsunami, vei: @eruption.vei, year: @eruption.year }
    end

    assert_redirected_to eruption_path(assigns(:eruption))
  end

  test "should show eruption" do
    get :show, id: @eruption
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @eruption
    assert_response :success
  end

  test "should update eruption" do
    patch :update, id: @eruption, eruption: { agent: @eruption.agent, country: @eruption.country, damage_cost: @eruption.damage_cost, damage_description: @eruption.damage_description, day: @eruption.day, death_count: @eruption.death_count, death_description: @eruption.death_description, earthquake: @eruption.earthquake, elevation: @eruption.elevation, eruption_type: @eruption.eruption_type, houses_destroyed: @eruption.houses_destroyed, houses_destroyed_description: @eruption.houses_destroyed_description, injury_count: @eruption.injury_count, injury_description: @eruption.injury_description, latitude: @eruption.latitude, location: @eruption.location, longitude: @eruption.longitude, missing_count: @eruption.missing_count, missing_description: @eruption.missing_description, month: @eruption.month, name: @eruption.name, status: @eruption.status, time: @eruption.time, total_damage_cost: @eruption.total_damage_cost, total_damage_description: @eruption.total_damage_description, total_deaths: @eruption.total_deaths, total_deaths_description: @eruption.total_deaths_description, total_houses_destroyed: @eruption.total_houses_destroyed, total_houses_destroyed_description: @eruption.total_houses_destroyed_description, total_injuries: @eruption.total_injuries, total_injuries_description: @eruption.total_injuries_description, total_missing: @eruption.total_missing, total_missing_description: @eruption.total_missing_description, tsunami: @eruption.tsunami, vei: @eruption.vei, year: @eruption.year }
    assert_redirected_to eruption_path(assigns(:eruption))
  end

  test "should destroy eruption" do
    assert_difference('Eruption.count', -1) do
      delete :destroy, id: @eruption
    end

    assert_redirected_to eruptions_path
  end
end
