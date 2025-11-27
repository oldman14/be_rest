import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed database...');

  // Tạo Branch mẫu
  let branch = await prisma.branch.findUnique({
    where: { id: 1 },
  });
  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        id: 1,
        name: 'Chi nhánh Quận 1',
        address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      },
    });
    console.log('✅ Đã tạo branch:', branch.name);
  } else {
    console.log('ℹ️  Branch đã tồn tại:', branch.name);
  }

  // Tạo Categories
  const categories = [
    { name: 'Món Khai Vị', displayOrder: 1 },
    { name: 'Món Chính', displayOrder: 2 },
    { name: 'Cơm & Mì', displayOrder: 3 },
    { name: 'Đồ Uống', displayOrder: 4 },
    { name: 'Tráng Miệng', displayOrder: 5 },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    let category = await prisma.category.findFirst({
      where: { name: cat.name },
    });
    if (!category) {
      category = await prisma.category.create({
        data: cat,
      });
      console.log(`✅ Đã tạo category: ${category.name}`);
    } else {
      console.log(`ℹ️  Category đã tồn tại: ${category.name}`);
    }
    createdCategories.push(category);
  }

  // Tạo Products với imageUrl trực tiếp
  const products = [
    // Món Khai Vị
    {
      categoryName: 'Món Khai Vị',
      name: 'Gỏi Cuốn Tôm Thịt',
      description: 'Bánh tráng cuốn tôm, thịt, bún, rau sống, chấm nước mắm pha',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Khai Vị',
      name: 'Chả Giò',
      description: 'Nem rán giòn, nhân tôm thịt, ăn kèm rau sống',
      price: 55000,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Khai Vị',
      name: 'Gỏi Đu Đủ Tôm Thịt',
      description: 'Đu đủ xanh trộn tôm, thịt, rau thơm, đậu phộng',
      price: 65000,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Khai Vị',
      name: 'Nem Nướng Nha Trang',
      description: 'Nem nướng than, chả cá, bánh tráng, rau sống',
      price: 75000,
      imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop',
    },

    // Món Chính
    {
      categoryName: 'Món Chính',
      name: 'Phở Bò Tái',
      description: 'Phở bò tái chín, bánh phở, hành ngò, giá',
      price: 85000,
      imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Chính',
      name: 'Bún Bò Huế',
      description: 'Bún bò Huế cay, chả cua, giò heo, rau sống',
      price: 90000,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Chính',
      name: 'Bánh Mì Thịt Nướng',
      description: 'Bánh mì giòn, thịt nướng, pate, chả lụa, rau củ',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Chính',
      name: 'Cơm Tấm Sườn Bì Chả',
      description: 'Cơm tấm sườn nướng, bì, chả trứng, đồ chua',
      price: 95000,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Chính',
      name: 'Bánh Xèo',
      description: 'Bánh xèo giòn, nhân tôm thịt, giá, đậu xanh',
      price: 70000,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Chính',
      name: 'Bún Chả Hà Nội',
      description: 'Bún chả thịt nướng, nước mắm pha, rau sống',
      price: 80000,
      imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Chính',
      name: 'Cá Kho Tộ',
      description: 'Cá tra kho tộ, thịt ba chỉ, nước dừa',
      price: 120000,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Món Chính',
      name: 'Thịt Kho Tàu',
      description: 'Thịt ba chỉ kho tàu, trứng vịt, nước dừa',
      price: 110000,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
    },

    // Cơm & Mì
    {
      categoryName: 'Cơm & Mì',
      name: 'Cơm Gà Hải Nam',
      description: 'Cơm gà Hải Nam, gà luộc, nước dùng, dưa leo',
      price: 85000,
      imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Cơm & Mì',
      name: 'Cơm Chiên Dương Châu',
      description: 'Cơm chiên Dương Châu, tôm, thịt, trứng, rau củ',
      price: 90000,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Cơm & Mì',
      name: 'Mì Quảng',
      description: 'Mì Quảng tôm thịt, bánh tráng, rau sống',
      price: 80000,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Cơm & Mì',
      name: 'Hủ Tiếu Nam Vang',
      description: 'Hủ tiếu Nam Vang, tôm, thịt, gan, trứng cút',
      price: 85000,
      imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Cơm & Mì',
      name: 'Bánh Canh Cua',
      description: 'Bánh canh cua, cua đồng, chả cá, hành ngò',
      price: 95000,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    },

    // Đồ Uống
    {
      categoryName: 'Đồ Uống',
      name: 'Cà Phê Đen Đá',
      description: 'Cà phê phin đen đá',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Đồ Uống',
      name: 'Cà Phê Sữa Đá',
      description: 'Cà phê phin sữa đá',
      price: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Đồ Uống',
      name: 'Nước Cam Ép',
      description: 'Nước cam tươi ép',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Đồ Uống',
      name: 'Sinh Tố Bơ',
      description: 'Sinh tố bơ, sữa đặc, đá xay',
      price: 50000,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Đồ Uống',
      name: 'Trà Đá',
      description: 'Trà đá mát lạnh',
      price: 15000,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Đồ Uống',
      name: 'Nước Dừa Tươi',
      description: 'Nước dừa tươi nguyên chất',
      price: 40000,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Đồ Uống',
      name: 'Chanh Dây',
      description: 'Nước chanh dây, đường, đá',
      price: 35000,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Đồ Uống',
      name: 'Trà Sữa',
      description: 'Trà sữa thái, trân châu, đá',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    },

    // Tráng Miệng
    {
      categoryName: 'Tráng Miệng',
      name: 'Chè Đậu Xanh',
      description: 'Chè đậu xanh, nước cốt dừa, đá',
      price: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Tráng Miệng',
      name: 'Chè Thái',
      description: 'Chè thái, thạch, trái cây, nước cốt dừa',
      price: 40000,
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Tráng Miệng',
      name: 'Kem Dừa',
      description: 'Kem dừa tươi, đá bào',
      price: 35000,
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    },
    {
      categoryName: 'Tráng Miệng',
      name: 'Bánh Flan',
      description: 'Bánh flan caramen, sữa tươi',
      price: 40000,
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    },
  ];

  // Tạo products
  for (const item of products) {
    const category = createdCategories.find((c) => c.name === item.categoryName);
    if (!category) {
      console.log(`⚠️  Không tìm thấy category: ${item.categoryName}`);
      continue;
    }

    let product = await prisma.product.findFirst({
      where: {
        categoryId: category.id,
        name: item.name,
      },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          categoryId: category.id,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          isActive: true,
        },
      });
      console.log(`✅ Đã tạo product: ${product.name} - ${product.price.toLocaleString('vi-VN')}đ`);
    } else {
      // Luôn cập nhật imageUrl nếu có thay đổi
      if (item.imageUrl && product.imageUrl !== item.imageUrl) {
        product = await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: item.imageUrl },
        });
        console.log(`🔄 Đã cập nhật ảnh cho: ${product.name}`);
      } else {
        console.log(`ℹ️  Product đã tồn tại: ${product.name}`);
      }
    }
  }

  // Tạo Tables mẫu
  const tables = [];
  for (let i = 1; i <= 10; i++) {
    let table = await prisma.table.findUnique({
      where: { id: i },
    });
    if (!table) {
      table = await prisma.table.create({
        data: {
          id: i,
          branchId: branch.id,
          name: `Bàn ${i}`,
          seats: i <= 5 ? 4 : 6,
          status: 'EMPTY',
        },
      });
      tables.push(table);
    }
  }
  console.log(`✅ Đã tạo/kiểm tra ${tables.length} bàn`);

  console.log('🎉 Seed database hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

