import { BoxComponent } from './BoxComponent/BoxComponent';
import { loadComponents, setEntryComponent } from './droplet';
import { MainComponent } from './MainComponent/MainComponent';

loadComponents(MainComponent, BoxComponent);
setEntryComponent(new MainComponent());
