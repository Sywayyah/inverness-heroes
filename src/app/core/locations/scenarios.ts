import type { GameStateService } from '../../services/game-state.service';
import { View, type ViewsService } from '../../services/views.service';
import { EntityRegistry } from '../registries';
import { GameArea, GameAreaRoom } from './game-area';

export interface Scenario {
  readonly id: string;
  readonly name: string;
  getDescription(): string;
  init(params: { readonly gameState: GameStateService; readonly views: ViewsService }): void;
}

export const DefaultScenario: Scenario = {
  id: 'default',
  name: 'Default',
  getDescription(): string {
    return 'Base scenario, start with 100 gold on the map';
  },
  init({ gameState, views }) {
    gameState.mainPlayer.gold.set(100);
    views.setActiveView(View.Map);

    const mainArea = new GameArea({
      height: 7,
      width: 7,
      areaName: 'Dungeon',
      defaultCellBgImage: 'images/tiles/black-area.png',
    });
    mainArea.setCellsBgImg({
      fromX: 1,
      fromY: 1,
      toX: 6,
      toY: 6,
      image: 'images/tiles/small-rocks.png',
    });

    mainArea.addRoom({
      x: 1,
      y: 1,
      room: new GameAreaRoom({ img: 'images/units/zombie.png', name: 'Prison Cell' }),
    });

    gameState.areas.push(mainArea);
    gameState.activeArea.set(mainArea);
  },
};

export const TestScenario: Scenario = {
  id: 'test',
  name: 'Test Scenario',
  getDescription(): string {
    return 'Test Scenario';
  },
  init({ gameState, views }) {
    gameState.mainPlayer.gold.set(25);
    views.setActiveView(View.Shop);
  },
};

export const scenariosRegistry = new EntityRegistry<Scenario>({ name: 'Scenarios' });

scenariosRegistry.register(DefaultScenario);
scenariosRegistry.register(TestScenario);
