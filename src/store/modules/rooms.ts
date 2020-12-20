import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/store";
import { Rooms } from "@/interface";

@Module({ dynamic: true, name: "rooms", store })
export default class RoomsModule extends VuexModule {
  rooms: Rooms[] = [];

  @Mutation
  private FILTER_ROOMS(filters: any) {
    let state = this.rooms;
    if (filters.toggle !== "") {
      state = state.filter((el: Rooms) => el.size === filters.toggle);
    }
    state = state.filter(
      (el: Rooms) =>
        el.floor >= filters.floor[0] && filters.floor[1] >= el.floor
    );
    state = state.filter(
      (el: Rooms) =>
        Math.round(el.square) >= filters.square[0] &&
        filters.square[1] >= Math.round(el.square)
    );
    state = state.filter(
      (el: Rooms) =>
        el.price >= +`${filters.price[0]}000000` &&
        +`${filters.price[1]}000000` >= el.price
    );
    this.rooms = state;
  }

  @Mutation
  private LOAD_DATA(rooms: Rooms[]) {
    this.rooms = rooms;
  }

  @Mutation
  private REST_ROOMS(rooms: Rooms[]) {
    this.rooms = rooms;
  }

  @Action
  loadData(rooms: Rooms[]) {
    this.context.commit("LOAD_DATA", rooms);
  }

  @Action
  filterRooms(filters: any) {
    this.context.commit("FILTER_ROOMS", filters);
  }

  @Action
  restRooms(rooms: Rooms[]) {
    this.context.commit("REST_ROOMS", rooms);
  }
}
