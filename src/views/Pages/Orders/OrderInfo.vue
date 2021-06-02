<template>
    <div class="container order">
        <div class="info">
            <div class="info__sender">
                <h2>Sender</h2>
                <p>
                    {{ order.name_send }}
                </p>
                <p>{{ order.address_send }}</p>
            </div>
            <div class="info__shipment">
                <h2>Shipment Information</h2>
                <ul>
                    <li>
                        <p>Receiver Name:</p>
                        <p>{{ order.name_cust }}</p>
                    </li>
                    <li>
                        <p>Shipping Address:</p>
                        <p>{{ order.address }}</p>
                    </li>
                    <li>
                        <p>Phone:</p>
                        <p>{{ order.tel }}</p>
                    </li>
                    <li>
                        <p>Email:</p>
                        <p>{{ order.email ? order.email : "No Data" }}</p>
                    </li>
                    <li>
                        <p>Delivery Status:</p>
                        <p>{{ order.status }}</p>
                    </li>
                    <li>
                        <p>Deliverer:</p>
                        <p>{{ order.type_send }}</p>
                    </li>
                </ul>
            </div>
            <div class="info__detail">
                <h2>Details</h2>
                <ul>
                    <li>
                        <p>Order ID:</p>
                        <p>{{ order.order_number }}</p>
                    </li>
                    <li>
                        <p>Order Date:</p>
                        <p>{{ order.date_order }}</p>
                    </li>
                    <li>
                        <p>Parcel ID:</p>
                        <p>{{ order.tack_post }}</p>
                    </li>
                    <li>
                        <p>Packing ID:</p>
                        <p>{{ order.packing_id }}</p>
                    </li>
                    <li>
                        <p>Packing Date:</p>
                        <p>{{ order.date_packing }}</p>
                    </li>
                    <li>
                        <p>Note:</p>
                        <p>{{ order.ment ? order.ment : "-" }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="waybill">
            <h2>Print label for parcels</h2>
            <button type="button" class="btn btn-primary">Print waybill</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    computed: {
        order() {
            return this.data[0];
        },
    },
};
</script>

<style scoped lang="scss">
$min-width: 180px;

.order {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax($min-width, 1fr));
}

.info {
    min-width: $min-width;
    max-width: 420px;

    ul {
        list-style: none;
        padding: 0;

        li {
            display: grid;
            grid-template-columns: repeat(
                auto-fit,
                minmax($min-width, max-content)
            );

            p:first-child {
                font-weight: bold;
            }
        }
    }
}

.waybill {
    width: 100%;
    text-align: center;
}
</style>