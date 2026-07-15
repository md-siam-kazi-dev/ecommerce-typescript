1.5 Product Details(GET)
URL
https://developers.cjdropshipping.com/api2.0/v1/product/query

CURL
curl --location --request GET 'https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=000B9312-456A-4D31-94BD-B083E2A198E8' \
                --header 'CJ-Access-Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
Parameter	Definition	Type	Required	Length	Note
pid	Product id	string	Choose one of pid, productSku, variantSku	200	Inquiry criteria, unique product identifier
productSku	Product sku	string	Choose one of pid, productSku, variantSku	200	Inquiry criteria, product SPU code
variantSku	variant sku	string	Choose one of pid, productSku, variantSku	200	Inquiry criteria, variant SKU code
features	features	List	N	200	Optional values: enable_combine (includes combination variants, returns combination product info when passed), enable_video (includes videos, returns product video info when passed)
countryCode	Country Code	string	N	2	Country code such as CN, US - Only returns variants with inventory in that country, no restriction if not passed
Return
Success

{
    "code": 200,
    "result": true,
    "message": "Success",
    "data": {
        "pid": "000B9312-456A-4D31-94BD-B083E2A198E8",
        "productName": "[\"攀爬车 拖斗车 \",\"攀爬车 \",\"拖斗车 \"]",
        "productNameEn": "Small trailer model",
        "productSku": "CJJJJTJT05843",
        "bigImage": "https://cf.cjdropshipping.com/quick/product/c1f9aae8-2b96-4ca7-9a67-1441d9596e3d.jpg",
        "productImageSet": ["https://cf.cjdropshipping.com/quick/product/c1f9aae8-2b96-4ca7-9a67-1441d9596e3d.jpg","https://cf.cjdropshipping.com/quick/product/a7657750-4318-47e8-875f-b6220ac35354.jpg"],
        "productWeight": "1500.0",
        "productUnit": "unit(s)",
        "productType": "ORDINARY_PRODUCT",
        "categoryId": "87CF251F-8D11-4DE0-A154-9694D9858EB3",
        "categoryName": "Home & Garden, Furniture / Home Storage / Home Office Storage",
        "entryCode": "8712008900",
        "entryName": "模型",
        "entryNameEn": "model",
        "materialName": "[\"\",\"金属\"]",
        "materialNameEn": "[\"\",\"metal\"]",
        "materialKey": "[\"METAL\"]",
        "packingWeight": "1580.0",
        "packingName": "[\"\",\"塑料袋\"]",
        "packingNameEn": "[\"\",\"plastic_bag\"]",
        "packingKey": "[\"PLASTIC_BAG\"]",
        "productKey": "[\"颜色\"]",
        "productKeyEn": "Color",
        "productPro": "[\"普货\"]",
        "productProSet": ["普货"],
        "productProEn": "[\"COMMON\"]",
        "productProEnSet": ["COMMON"],
        "sellPrice": 58.09,
        "description": "....",
        "suggestSellPrice": "0.97-4.08",
        "listedNum": 392,
        "status": "3",
        "supplierName": "",
        "supplierId": "",
        "customizationVersion": 1,
        "customizationJson1": "",
        "customizationJson2": "",
        "customizationJson3": "",
        "customizationJson4": "",
        "variants": [
            {
                "vid": "D4057F56-3F09-4541-8461-9D76D014846D",
                "pid": "000B9312-456A-4D31-94BD-B083E2A198E8",
                "variantName": null,
                "variantNameEn": "Small trailer model Black",
                "variantSku": "CJJJJTJT05843-Black",
                "barcode": "6973990191234",
                "barcode2": "BC2A001",
                "variantUnit": null,
                "variantKey": "Black-XXL",
                "variantLength": 300,
                "variantWidth": 200,
                "variantHeight": 100,
                "variantVolume": 6000000,
                "variantWeight": 1580.00,
                "variantSellPrice": 58.09,
                "createTime": "2019-12-31T11:14:12.000+00:00"
                "variantStandard": "long=110,width=110,height=30",
                "variantSugSellPrice": 0.97
                "combineVariants":[{}],
                "inventories": [
                    {
                        "countryCode": "CN",
                        "totalInventory": 12912,
                        "cjInventory": 0,
                        "factoryInventory": 12912,
                        "verifiedWarehouse": 2,
                        "stock": [
                            {
                                "stockId": "{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}",
                                "inventory": 0,
                                "factoryInventory": 12912
                            }
                        ]
                    }
                ]
            }...
        ],
        "createrTime": "2019-12-24T01:06:37+08:00"
    },
    "requestId": "d8dc0b6d-0ed8-4e19-8f63-3f207ac39832"
}