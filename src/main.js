import { Checkbox } from './Checkbox/Checkbox';
import { loadComponents, setEntryComponent } from './droplet';
import { ListItem } from './ListItem/ListItem';
import { MainComponent } from './MainComponent/MainComponent';

loadComponents(MainComponent, ListItem, Checkbox);
setEntryComponent(new MainComponent());
