<?php

namespace App\Repository;

use App\Entity\Tag;
use App\Model\OrderByDto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tag>
 */
class TagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tag::class);
    }

    public function findByCustom(
        array $criteria,
        ?array $orderBy = null, ?int $limit = null, ?int $offset = null
    ): array
    {
        $query = $this->createQueryBuilder('t')
            ->leftJoin('t.type', 'tt')->addSelect('tt')
        ;

        foreach ($criteria as $key => $val) {
            break;
        }

        if ($orderBy) {
            $orderBys = [];

            foreach ($orderBy as $val) {
                \array_push($orderBys, OrderByDto::parse($val));
            }

            foreach ($orderBys as $val) {
                switch ($val->name) {
                    case 'typeCode':
                        $val->name = 'tt.code';
                        break;
                    case 'createdAt':
                    case 'updatedAt':
                    case 'code':
                    case 'name':
                        $val->name = 't.' . $val->name;
                        break;
                    default:
                        continue 2;
                }

                switch (\strtolower($val->order ?? '')) {
                    case 'a':
                    case 'asc':
                    case 'ascending':
                        $val->order = 'ASC';
                        break;
                    case 'd':
                    case 'desc':
                    case 'descending':
                        $val->order = 'DESC';
                        break;
                    default:
                        $val->order = null;
                }

                if ($val->nulls) {
                    switch (\strtolower($val->nulls ?? '')) {
                        case 'f':
                        case 'first':
                            $val->nulls = 'DESC';
                            break;
                        case 'l':
                        case 'last':
                            $val->nulls = 'ASC';
                            break;
                        default:
                            $val->nulls = null;
                    }

                    $vname = \str_replace('.', '', $val->name);
                    $vselc = '(CASE WHEN ' . $val->name . ' IS NULL THEN 1 ELSE 0 END) AS HIDDEN ' . $vname;

                    $query->addSelect($vselc);
                    $query->addOrderBy($vname, $val->nulls);
                }

                $query->addOrderBy($val->name, $val->order);
            }
        } else {
            $query->orderBy('tt.type');
            $query->orderBy('t.code');
        }

        $query->setMaxResults($limit);
        $query->setFirstResult($offset);

        return $query->getQuery()->getResult();
    }

    public function countCustom(array $criteria = []): int
    {
        $query = $this->createQueryBuilder('t')
            ->select('count(t.id)')
        ;

        foreach ($criteria as $key => $val) {
            break;
        }

        return $query->getQuery()->getSingleScalarResult();
    }
}
