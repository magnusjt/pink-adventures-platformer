///<reference path="_references.ts"/>
module SuperGame{
    export class ContactListener extends Box2D.Dynamics.b2ContactListener {
        /**
         * Called when two fixtures begin to touch.
         * @param contact Contact point.
         **/
        public BeginContact(contact:Box2D.Dynamics.Contacts.b2Contact):void {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();

            var udA = <B2UserData>(fixtureA.GetBody().GetUserData());
            var udB = <B2UserData>(fixtureB.GetBody().GetUserData());

            if (udA.type == B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomBeginContact(udA, udB);
            } else if (udB.type == B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomBeginContact(udB, udA);
            } else if (udA.type == B2_TYPE.PLAYER && udB.type == B2_TYPE.ITEM) {
                this.HandlePlayerItemBeginContact(udA, udB);
            } else if (udA.type == B2_TYPE.ITEM && udB.type == B2_TYPE.PLAYER) {
                this.HandlePlayerItemBeginContact(udB, udA);
            }
        }

        public HandlePlayerBottomBeginContact(player_user_data:B2UserData, other_user_data:B2UserData) {
            if (other_user_data.type == B2_TYPE.GROUND || other_user_data.type == B2_TYPE.ITEM) {
                (<Player>player_user_data.instance).touched_ground();
            }
        }

        public HandlePlayerItemBeginContact(player_user_data:B2UserData, item_user_data:B2UserData) {
            (<Player>player_user_data.instance).handle_collision_with_item(<Item>item_user_data.instance);
        }

        /**
         * Called when two fixtures cease to touch.
         * @param contact Contact point.
         **/
        public EndContact(contact:Box2D.Dynamics.Contacts.b2Contact):void {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();

            var udA = <B2UserData>(fixtureA.GetBody().GetUserData());
            var udB = <B2UserData>(fixtureB.GetBody().GetUserData());

            if (udA.type == B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomEndContact(udA, udB);
            } else if (udB.type == B2_TYPE.PLAYER_BOTTOM) {
                this.HandlePlayerBottomEndContact(udB, udA);
            }
        }

        public HandlePlayerBottomEndContact(player_user_data:B2UserData, other_user_data:B2UserData) {
            if (other_user_data.type == B2_TYPE.GROUND || other_user_data.type == B2_TYPE.ITEM) {
                (<Player>player_user_data.instance).left_ground();
            }
        }

        /**
         * This lets you inspect a contact after the solver is finished. This is useful for inspecting impulses. Note: the contact manifold does not include time of impact impulses, which can be arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly in a separate data structure. Note: this is only called for contacts that are touching, solid, and awake.
         * @param contact Contact point.
         * @param impulse Contact impulse.
         **/
        public PostSolve(contact:Box2D.Dynamics.Contacts.b2Contact, impulse:Box2D.Dynamics.b2ContactImpulse):void {

        }

        /**
         * This is called after a contact is updated. This allows you to inspect a contact before it goes to the solver. If you are careful, you can modify the contact manifold (e.g. disable contact). A copy of the old manifold is provided so that you can detect changes. Note: this is called only for awake bodies. Note: this is called even when the number of contact points is zero. Note: this is not called for sensors. Note: if you set the number of contact points to zero, you will not get an EndContact callback. However, you may get a BeginContact callback the next step.
         * @param contact Contact point.
         * @param oldManifold Old manifold.
         **/
        public PreSolve(contact:Box2D.Dynamics.Contacts.b2Contact, oldManifold:Box2D.Collision.b2Manifold):void {

        }
    }
}