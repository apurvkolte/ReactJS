import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps
} from '@react-navigation/drawer';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps
} from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ==================== TYPE DEFINITIONS ====================

// Define navigation param types
export type RootStackParamList = {
  HomeStack: undefined;
  ItemStack: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
};

export type ItemStackParamList = {
  ItemList: undefined;
  AddItem: undefined;
  CategoryList: undefined;
  Inventory: undefined;
  Settings: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  ItemStack: undefined;
  Settings: undefined;
};

// Define types for navigation props
type CustomDrawerContentProps = DrawerContentComponentProps;
type HomeScreenProps = StackScreenProps<HomeStackParamList, 'HomeScreen'>;
type ItemListScreenProps = StackScreenProps<ItemStackParamList, 'ItemList'>;
type AddItemScreenProps = StackScreenProps<ItemStackParamList, 'AddItem'>;
type CategoryListScreenProps = StackScreenProps<ItemStackParamList, 'CategoryList'>;
type InventoryScreenProps = StackScreenProps<ItemStackParamList, 'Inventory'>;
type SettingsScreenProps = StackScreenProps<ItemStackParamList, 'Settings'>;

// Define type for menu items
interface MenuItem {
  name: string;
  icon: string;
  screen: keyof DrawerParamList | keyof ItemStackParamList;
  submenus?: Array<{
    name: string;
    screen: keyof ItemStackParamList;
  }>;
}

// Define type for expanded menus state
interface ExpandedMenusState {
  [key: string]: boolean;
}

// Define type for HeaderMenuIcon props
interface HeaderMenuIconProps {
  navigation: StackNavigationProp<any> & {
    openDrawer: () => void;
  };
}

// ==================== COMPONENTS ====================

// Create navigators with proper typing
const Drawer = createDrawerNavigator<DrawerParamList>();
const ItemStack = createStackNavigator<ItemStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

// Color constants for menu icons
const MENU_ICON_COLORS = {
  WHITE: '#FFFFFF',
  PRIMARY: '#2196F3',
  DARK: '#333333',
  GRAY: '#666666',
  LIGHT_GRAY: '#999999'
} as const;

// Custom Drawer Content Component
const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenusState>({});

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      icon: 'home',
      screen: 'Home',
    },
    {
      name: 'Inventory',
      icon: 'inventory',
      screen: 'Inventory',
      submenus: [
        { name: 'Items', screen: 'ItemList' },
        { name: 'Add Item', screen: 'AddItem' },
        { name: 'Categories', screen: 'CategoryList' },
      ]
    },
    {
      name: 'Settings',
      icon: 'settings',
      screen: 'Settings',
    }
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.submenus) {
      toggleMenu(item.name);
    } else {
      props.navigation.navigate(item.screen as any);
    }
  };

  const handleSubmenuPress = (screen: keyof ItemStackParamList) => {
    props.navigation.navigate('ItemStack', { screen });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Menu</Text>
      </View>

      {menuItems.map((item) => (
        <View key={item.name}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item)}
          >
            <View style={styles.menuItemContent}>
              <Icon
                name={item.icon as any}
                size={24}
                color={MENU_ICON_COLORS.DARK}
              />
              <Text style={styles.menuItemText}>{item.name}</Text>
            </View>
            {item.submenus && (
              <Icon
                name={expandedMenus[item.name] ? 'expand-less' : 'expand-more'}
                size={24}
                color={MENU_ICON_COLORS.GRAY}
              />
            )}
          </TouchableOpacity>

          {item.submenus && expandedMenus[item.name] && (
            <View style={styles.submenuContainer}>
              {item.submenus.map((submenu) => (
                <TouchableOpacity
                  key={submenu.name}
                  style={styles.submenuItem}
                  onPress={() => handleSubmenuPress(submenu.screen)}
                >
                  <Icon
                    name="chevron-right"
                    size={20}
                    color={MENU_ICON_COLORS.LIGHT_GRAY}
                  />
                  <Text style={styles.submenuText}>{submenu.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </DrawerContentScrollView>
  );
};

// Reusable Header Menu Icon Component
const HeaderMenuIcon: React.FC<HeaderMenuIconProps> = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.menuIcon}
      onPress={() => navigation.openDrawer()}
    >
      <Icon name="menu" size={28} color={MENU_ICON_COLORS.WHITE} />
    </TouchableOpacity>
  );
};

// Home Stack Navigator
const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Home',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <HeaderMenuIcon navigation={navigation as any} />
          ),
        })}
      />
    </HomeStack.Navigator>
  );
};

// Item Stack Navigator
const ItemStackNavigator: React.FC = () => {
  return (
    <ItemStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: MENU_ICON_COLORS.WHITE,
        headerTitleStyle: {
          fontWeight: 'bold' as const,
        },
      }}
    >
      <ItemStack.Screen
        name="ItemList"
        component={ItemListScreen}
        options={({ navigation }) => ({
          title: 'Items',
          headerLeft: () => (
            <HeaderMenuIcon navigation={navigation as any} />
          )
        })}
      />
      <ItemStack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={({ navigation }) => ({
          title: 'Add Item',
          headerLeft: () => (
            <HeaderMenuIcon navigation={navigation as any} />
          )
        })}
      />
      <ItemStack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={({ navigation }) => ({
          title: 'Categories',
          headerLeft: () => (
            <HeaderMenuIcon navigation={navigation as any} />
          )
        })}
      />
      <ItemStack.Screen
        name="Inventory"
        component={InventoryScreen}
        options={({ navigation }) => ({
          title: 'Inventory',
          headerLeft: () => (
            <HeaderMenuIcon navigation={navigation as any} />
          )
        })}
      />
    </ItemStack.Navigator>
  );
};

// Screen Components
const HomeScreen: React.FC<HomeScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

const ItemListScreen: React.FC<ItemListScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Item List Screen</Text>
    </View>
  );
};

const AddItemScreen: React.FC<AddItemScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Add Item Screen</Text>
    </View>
  );
};

const CategoryListScreen: React.FC<CategoryListScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Category List Screen</Text>
    </View>
  );
};

const InventoryScreen: React.FC<InventoryScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Inventory Screen</Text>
    </View>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
};

// Main App Navigator with Drawer
const AppNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 300,
        },
        drawerActiveTintColor: MENU_ICON_COLORS.PRIMARY,
        drawerInactiveTintColor: MENU_ICON_COLORS.DARK,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ItemStack"
        component={ItemStackNavigator}
        options={{
          title: 'Inventory Management',
          drawerIcon: ({ color, size }) => (
            <Icon name="inventory" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

// ==================== STYLES ====================

interface Styles {
  container: ViewStyle;
  menuIcon: ViewStyle;
  drawerHeader: ViewStyle;
  drawerTitle: TextStyle;
  menuItem: ViewStyle;
  menuItemContent: ViewStyle;
  menuItemText: TextStyle;
  submenuContainer: ViewStyle;
  submenuItem: ViewStyle;
  submenuText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 15,
    padding: 10,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: MENU_ICON_COLORS.PRIMARY,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MENU_ICON_COLORS.WHITE,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: MENU_ICON_COLORS.DARK,
  },
  submenuContainer: {
    backgroundColor: '#f5f5f5',
    paddingLeft: 40,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  submenuText: {
    fontSize: 14,
    marginLeft: 8,
    color: MENU_ICON_COLORS.GRAY,
  },
});

export default App;