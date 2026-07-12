import type { GameStateService } from '../../services/game-state.service';
import { View, type ViewsService } from '../../services/views.service';
import { EntityRegistry } from '../registries';
import { GameArea, AreaObject } from '../locations/game-area';

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

    const secondArea = new GameArea({
      height: 7,
      width: 7,
      areaName: 'Catacombs',
      defaultCellBgImage: 'images/tiles/black-area.png',
    });

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

    secondArea.setCellsBgImg({
      fromX: 1,
      fromY: 1,
      toX: 6,
      toY: 6,
      image: 'images/tiles/rocky-floor.png',
    });

    mainArea.addAreaObject({
      x: 1,
      y: 1,
      object: new AreaObject({
        img: 'images/units/zombie.png',
        name: 'Prison Cell',
        onClick() {
          views.setActiveView(View.Battle);
        },
      }),
    });

    mainArea.addAreaObject({
      x: 5,
      y: 3,
      object: new AreaObject({
        img: 'images/tiles/path.png',
        name: 'Path to Catacombs',
        onClick: () => {
          gameState.activeArea.set(secondArea);
        },
      }),
    });

    mainArea.addAreaObject({
      x: 3,
      y: 3,
      object: new AreaObject({
        img: 'images/tiles/sign.png',
        name: 'Shop',
        onClick() {
          views.setActiveView(View.Shop);
        },
      }),
    });

    secondArea.addAreaObject({
      x: 1,
      y: 3,
      object: new AreaObject({
        img: 'images/tiles/path.png',
        name: 'Path to Dungeon',
        onClick() {
          gameState.activeArea.set(mainArea);
        },
      }),
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
