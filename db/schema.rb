# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151130193819) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "earthquakes", force: :cascade do |t|
    t.integer  "usgs_id"
    t.boolean  "tsunami"
    t.integer  "year"
    t.integer  "month"
    t.integer  "day"
    t.integer  "hour"
    t.integer  "minute"
    t.integer  "second"
    t.integer  "focal_depth"
    t.decimal  "eq_primary"
    t.decimal  "eq_mag_mw"
    t.decimal  "eq_mag_ms"
    t.decimal  "eq_mag_mb"
    t.decimal  "eq_mag_ml"
    t.decimal  "eq_mag_mfa"
    t.decimal  "eq_mag_unk"
    t.integer  "intensity"
    t.string   "country"
    t.string   "state"
    t.string   "location"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.integer  "region_code"
    t.integer  "houses_damaged"
    t.integer  "houses_damaged_description"
    t.integer  "total_houses_damaged"
    t.integer  "total_houses_damaged_description"
    t.integer  "death_count"
    t.integer  "death_description"
    t.integer  "missing_count"
    t.integer  "missing_description"
    t.integer  "injury_count"
    t.integer  "injury_description"
    t.integer  "damage_cost"
    t.integer  "damage_description"
    t.integer  "houses_destroyed"
    t.integer  "houses_destroyed_description"
    t.integer  "total_deaths"
    t.integer  "total_deaths_description"
    t.integer  "total_missing"
    t.integer  "total_missing_description"
    t.integer  "total_injuries"
    t.integer  "total_injuries_description"
    t.integer  "total_damage_cost"
    t.integer  "total_damage_description"
    t.integer  "total_houses_destroyed"
    t.integer  "total_houses_destroyed_description"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
  end

  create_table "eruptions", force: :cascade do |t|
    t.integer  "year"
    t.integer  "month"
    t.integer  "day"
    t.boolean  "tsunami"
    t.boolean  "earthquake"
    t.string   "name"
    t.string   "location"
    t.string   "country"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.integer  "elevation"
    t.string   "eruption_type"
    t.string   "status"
    t.string   "time"
    t.integer  "vei"
    t.string   "agent"
    t.integer  "death_count"
    t.integer  "death_description"
    t.integer  "missing_count"
    t.integer  "missing_description"
    t.integer  "injury_count"
    t.integer  "injury_description"
    t.integer  "damage_cost"
    t.integer  "damage_description"
    t.integer  "houses_destroyed"
    t.integer  "houses_destroyed_description"
    t.integer  "total_deaths"
    t.integer  "total_deaths_description"
    t.integer  "total_missing"
    t.integer  "total_missing_description"
    t.integer  "total_injuries"
    t.integer  "total_injuries_description"
    t.integer  "total_damage_cost"
    t.integer  "total_damage_description"
    t.integer  "total_houses_destroyed"
    t.integer  "total_houses_destroyed_description"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
  end

end
